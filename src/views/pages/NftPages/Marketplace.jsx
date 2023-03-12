import HeroMarketplace from '../../../components/hero/HeroMarketplace';
import MenuCategoriesMarket from '../elements/MenuCategoriesMarket';
import React from 'react';
import SiteFooter from '../../../components/footer/SiteFooter';
import SiteHeader from '../../../components/header/SiteHeader';
import useDocumentTitle from '../../../components/useDocumentTitle';
import { useEffect, useState } from "react";

import { ethers } from 'ethers';
import contract from '../../../contract/nft.json';
import env from "react-dotenv";

const Marketplace = (props) => {

  const [minted, setMinted] = useState(0);
  const [mainPrice, setMainPrice] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);


  useEffect(() => {
    fetchSmartContract();
  }, [props.chainId]);

  const fetchSmartContract = () => {
    const provider = new ethers.providers.InfuraProvider(env.CHAIN, env.INFRA_KEY);
    const nftContract = new ethers.Contract(contract.address, contract.abi, provider);
    let promises = [nftContract.minted(), nftContract.price(), nftContract.maxSupply()];
    Promise.all(promises).then((res) => {
      let mint = res[0];
      let price = res[1];
      let supply = res[2];
      setMinted(Number(mint._hex));
      setMainPrice(Number(price));
      setMaxSupply(Number(supply));
    }).catch((err) => {
      console.log(err);
      setMinted(0);
      setMainPrice(0);
      setMaxSupply(0);
    }).finally(() => {

    });
  };

  const mintNFT = (qty, callback) => {
    if (props.status === "connected") {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contract.address, contract.abi, signer);
        nftContract.mint(qty, { value: ethers.utils.parseEther(ethers.utils.formatEther((qty * mainPrice).toString())) }).then((res) => {
          res.wait().then((response) => {
            if (callback && typeof callback === 'function') {
              callback(true);
              fetchSmartContract();
            }
          }).catch((error) => {

            console.log(error);
            callback(false);
          }).finally(() => {

          });
        }).catch((err) => {
          console.log(err);
          callback(false);
        }).finally(() => {

        });
      } else {
        console.log("Ethereum object does not exist");
      }
    }

  };

  useDocumentTitle(' Marketplace');
  return (
    <div>
      <SiteHeader {...props} />
      <HeroMarketplace />
      <div className="d-flex justify-content-center">
        <MenuCategoriesMarket {...props} minted={minted} mainPrice={mainPrice} maxSupply={maxSupply} countPerPage={12} mintNFT={mintNFT} />
      </div>
      <SiteFooter {...props} />
    </div>
  );
};

export default Marketplace;
