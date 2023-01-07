const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const fs = require("fs");
const app = express();
const cors = require("cors");
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
const port = process.env.BACKEND_PORT || 8082;

app.listen(port, 'localhost', () => console.log(`Server running on port ${port}`));