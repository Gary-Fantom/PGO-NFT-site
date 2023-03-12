import { ethers } from 'ethers';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Pagination from './Pagination';
import env from "react-dotenv";

function CardsCreators(props) {
  
  const ref = useRef();
  const resultRef = useRef();
  const closeTooltip = () => ref.current.close();
  const openResultTooltip = () => resultRef.current.open();

  const [countPerPage, setCountPerPage] = useState(0);
  const [nftItems, setNftItems] = useState([]);
  const [maxSupply, setMaxSupply] = useState(0);
  const [minted, setMinted] = useState(0);
  const [mainPrice, setMainPrice] = useState(0);
  const [page, setPage] = useState(0);
  const [mintQty, setMintQty] = useState(1);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [status, setStatus] = useState("");
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    setMaxSupply(typeof props.maxSupply === 'number' ? props.maxSupply : 0);
    setMinted(typeof props.minted === 'number' ? props.minted : 0);
    setMainPrice(typeof props.mainPrice === 'number' ? props.mainPrice : 0);
    setCountPerPage(typeof props.countPerPage === 'number' ? props.countPerPage : 12);
    setStatus(props.status);
    setChainId(props.chainId);
  }, [props.maxSupply, props.minted, props.mainPrice, props.countPerPage, props.status, props.chainId]);

  useEffect(() => {
    fetchNFTItems();
  }, [page, countPerPage, maxSupply, minted]);

  const fetchNFTItems = () => {
    let promises = [];
    for (let index = page * countPerPage + minted; index < (page + 1) * countPerPage + minted && index < maxSupply; index++) {
      promises.push(fetch(env.BACKEND_ORIGIN + '/arts/jsons/' + (index),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ));
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
            title: item.name,
            price: mainPrice,
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

  const mintNFT = () => {
    if (props.mintNFT && typeof props.mintNFT === 'function' && mintQty > 0) {
      props.mintNFT(mintQty, (bSuccess) => {
        setMintSuccess(bSuccess);
        setMinting(false);
        openResultTooltip();
      });
      setMinting(true);
    }
  };

  const limit = 2;
  const handleNumChange = event => {
    setMintQty(event.target.value.slice(0, limit));
  };

  return (
    <div className='d-flex flex-column'>
      {status === 'connected' ? (chainId === props.networks[props.info.chain] ? (
        <Popup
          className="custom"
          ref={ref}
          trigger={
            <div className="btn btn-grad btn-sm m-auto" style={{ minWidth: 130 }}>
              <i className="ri-wallet-3-line" />
              Mint
            </div>
          }
          position="bottom center">
          <div>
            <div
              className="popup"
              id="popup_bid"
              tabIndex={-1}
              role="dialog"
              aria-hidden="true">
              <div>
                <button
                  type="button"
                  className="button close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeTooltip}>
                  <span aria-hidden="true">×</span>
                </button>
                <div className=" space-y-20">
                  <h3>Mint</h3>
                  <p>
                    Enter quantity(1 ~ 10)
                  </p>
                  <input
                    type="number"
                    className="form-control"
                    value={mintQty}
                    min={1}
                    max={10}
                    maxLength="2"
                    onChange={(e) => { handleNumChange(e) }}
                    disabled={minting}
                  />
                  <div className="hr" />
                  <p className="txt_sm">
                    {'Price' + ' : '}
                    <span
                      className="color_green txt_sm">
                      {ethers.utils.formatEther(ethers.BigNumber.from((mintQty * mainPrice).toString()))} ETH
                    </span>
                  </p>
                  <div className="hr" />
                  <button className="btn btn-primary w-full" disabled={mintQty > 10 || mintQty < 1 || minting} onClick={() => { mintNFT() }}>
                    {
                      minting && (
                        <span>
                          <span className="spinner-grow spinner-grow-sm mr-2" role="status" aria-hidden="true"></span>
                          Minting...
                        </span>
                      )
                    }
                    {
                      !minting && (
                        <span>Mint</span>
                      )
                    }
                  </button>
                  <Popup
                    className="custom"
                    ref={resultRef}
                    trigger={false}
                    position="bottom center">
                    <div>
                      <div
                        className="popup"
                        id="popup_bid"
                        tabIndex={-1}
                        role="dialog"
                        aria-hidden="true">
                        <div>
                          <button
                            type="button"
                            className="button close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={closeTooltip}>
                            <span aria-hidden="true">×</span>
                          </button>
                          <div className="space-y-20">
                            <h3 className="text-center">
                              {mintSuccess ? 'Success' : 'Fail'}
                            </h3>
                            <p className="text-center">
                              {mintSuccess ? 'Mint was completed successfully!' : 'Mint was failed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      ) : <div className='m-auto'>
        Swich Wallet to Mint NFT
      </div>) : (
        <div className='m-auto'>
          Connect Wallet to Mint NFT
        </div>
      )}

      <div className="row mt-3 mb-30_reset">

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
                    <Link to="#">
                      <p className="txt_sm">
                        Price:
                        <span
                          className="color_green txt_sm">
                          {ethers.utils.formatEther(ethers.BigNumber.from(val.price.toString()))} ETH
                        </span>
                      </p>
                    </Link>
                  </div>
                  <div className="hr" />
                  <div
                    className="d-flex
                                  align-items-center
                                  space-x-10
                                  justify-content-between">
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <Pagination total={maxSupply - minted} page={page} countPerPage={countPerPage} setPage={(pageNumber) => { setPage(pageNumber) }} />
      </div>
    </div>

  );
}

export default CardsCreators;
