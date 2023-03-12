const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const fs = require("fs");
const app = express();
const cors = require("cors");
const request = require('request');
const pengolinSwap = require('./src/contract/pengolinswap.json');
var ethers = require('ethers');

let corsOptions = {
    origin: process.env.FRONT_ORIGIN.split(' ')
};

app.use(cors(corsOptions));

app.get('/arts/:artType/:tokenId', (req, res) => {
    const artType = req.params.artType;
    const tokenId = req.params.tokenId;
    if (artType === null || artType === undefined || (artType !== 'images' && artType !== 'jsons')) {
        res.send('404');
    } else {
        var fileContents = fs.readFileSync('./public/arts/' + artType + '/' + tokenId);
        if (artType === 'jsons') {
            res.send(fileContents.toString());
        } else {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(fileContents);
        }
    }
});

app.get('/signature/:txHash/:txAmount', (req, res) => {
    const txHash = req.params.txHash;
    const txAmount = req.params.txAmount;

    const api = 'https://blockexplorer.pengolincoin.xyz/api/getrawtransaction?txid=' + txHash + '&decrypt=1';
    request(api, function (error, response, body) {
        if (error) {
            res.send({ 'success': false, 'msg': error });
            return;
        }
        if (response && response.statusCode === 200 && body.indexOf('There was an error. Check your console') === -1) {
            try {
                body = JSON.parse(body);
                const confirmations = body.confirmations;
                if (confirmations < 3) {
                    res.send({ 'success': false, 'msg': 'Transaction is not confirmed yet' });
                    return;
                }
                const vouts = body.vout.filter((item) => parseFloat(item.value) === parseFloat(txAmount) && item.scriptPubKey.addresses.indexOf(process.env.TARGET_PGO_ADDRESS) > -1);
                if (vouts.length === 0) {
                    res.send({ 'success': false, 'msg': 'Invalid Transaction Amount or Target Address' });
                    return;
                }

                const provider = new ethers.providers.InfuraProvider(process.env.CHAIN, process.env.INFRA_KEY);
                const nftContract = new ethers.Contract(pengolinSwap.address, pengolinSwap.abi, provider);
                
                nftContract.getMessageHash(txHash, ethers.utils.parseEther(txAmount, 'ether')).then((response) => {
                    let wallet = new ethers.Wallet(process.env.SIGNATURE_PRIVATE_KEY);
                    wallet.signMessage(ethers.utils.arrayify(response)).then((signature) => {
                        res.send({ 'success': true, 'msg': signature, 'hash': response });
                    }).catch((err) => {
                        res.send({ 'success': false, 'msg': err });
                    });
                }).catch((err) => {
                }).finally(() => {
                });

            } catch (error) {
                console.log(error);
                res.send({
                    'success': false, 'msg': 'Invalid Transaction Hash'
                });
            }
        } else {
            res.send({ 'success': false, 'msg': 'Invalid Transaction Hash' });
        }
    });
});

const port = process.env.BACKEND_PORT || 8082;
console.log(port);

app.listen(port, 'localhost', () => console.log(`Server running on port ${port}`));