import React, { useRef } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import contract from '../../contract/nft.json';
import { ethers } from 'ethers';
import { useState } from 'react';
import env from "react-dotenv";

const CardProfile = (props) => {

  const [myTokens, setMyTokens] = useState([]);
  const [nftItems, setNftItems] = useState([]);

  useEffect(() => {
    if (props.status === "connected") {
      getTransferEvents();
    }
  }, [props.status, props.chainId]);

  const getTransferEvents = async () => {
    const tokens = [];
    const { ethereum } = window;
    if (ethereum && props.account) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contract.address, contract.abi, signer);

      nftContract.queryFilter('Transfer', 0, props.minted).then((events) => {
        for (let event of events) {
          if (ethers.utils.getAddress(event.args.to) === ethers.utils.getAddress(props.account.toString())) {
            const tokenId = Number(event.args.tokenId._hex);
            if (tokens.indexOf(tokenId) === -1) {
              tokens.push(tokenId);
            }
          }

          if (ethers.utils.getAddress(event.args.from) === ethers.utils.getAddress(props.account.toString())) {
            const tokenId = Number(event.args.tokenId._hex);
            if (tokens.indexOf(tokenId) > -1) {
              tokens.splice(tokens.indexOf(tokenId), 1);
            }
          }
        }
        setMyTokens(tokens);
      });
    }
  };

  useEffect(() => {
    fetchNFTItems();
  }, [myTokens]);

  const fetchNFTItems = () => {
    let promises = [];
    if (myTokens && myTokens.length > 0) {
      myTokens.forEach(index => {
        promises.push(fetch(env.BACKEND_ORIGIN + '/arts/jsons/' + (index),
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        ));
      });
    }

    Promise.all(promises).then((res) => {
      let jsonPromises = [];
      res.forEach(element => {
        jsonPromises.push(element.json());
      });
      Promise.all(jsonPromises).then((response) => {
        let nfts = [];
        response.forEach(item => {
          let nft = {
            index: item.index,
            img: item.index,
            title: item.name
          };
          nfts.push(nft);
        });
        setNftItems(nfts);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {

      });
    }).catch((err) => {
      console.log(err);
    }).finally(() => {

    });
  };

  const ref = useRef();
  const closeTooltip = () => ref.current.close();
  return (
    <div className="row mb-30_reset w-100">
      {nftItems.map((val, i) => (
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={i}>
          <div className="card__item four">
            <div className="card_body space-y-10">
              {/* =============== */}
              <div className="card_head">
                <Link to={{ pathname: 'Item-details', state: { nft: val } }}>
                  <img src={`${env.BACKEND_ORIGIN}/arts/images/${val.index}`} alt="nftimage" />
                </Link>
              </div>
              {/* =============== */}
              <h6 className="card_title">{val.title}</h6>
              <div className="card_footer d-block space-y-10">
                <div className="card_footer justify-content-between">
                </div>
                <div className="hr" />
                <div
                  className="d-flex
                                  align-items-center
                                  space-x-10
                                  justify-content-between">
                  <Link className="btn btn-sm btn-primary" to={{ pathname: 'https://' + props.info.net + '.opensea.io/assets/' + props.info.chain + '/' + contract.address + '/' + val.index }} target="_blank">
                    Sell
                  </Link>
                  <Link className="btn btn-sm btn-primary" to={{ pathname: 'https://' + props.info.net + '.opensea.io/assets/' + props.info.chain + '/' + contract.address + '/' + val.index }} target="_blank">
                    Play
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardProfile;
