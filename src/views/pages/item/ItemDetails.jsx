import 'reactjs-popup/dist/index.css';

import React, { useRef, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';
import Popup from 'reactjs-popup';
import SiteFooter from '../../../components/footer/SiteFooter';
import SiteHeader from '../../../components/header/SiteHeader';
import useDocumentTitle from '../../../components/useDocumentTitle';
import { useEffect } from 'react';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from 'react-accessible-accordion';
import contract from '../../../contract/nft.json';
import { ethers } from 'ethers';
import env from "react-dotenv";

const ItemDetails = (props) => {
  const location = useLocation();
  const ref = useRef();
  const [isShare, setShare] = useState(false);
  const [nftDetail, setNFTDetail] = useState(null);
  const [minted, setMinted] = useState(0);
  if (!location.state || !location.state.nft) {
    document.location.href = '/';
  }
  const nft = location.state.nft;
  useEffect(() => {
    if (props.status === "connected") {
      fetchSmartContract();
    }
  }, [props.status, props.chainId]);

  const fetchSmartContract = () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contract.address, contract.abi, signer);
      let promises = [nftContract.minted()];
      Promise.all(promises).then((res) => {
        let mint = res[0];
        setMinted(Number(mint._hex));
      }).catch((err) => {
        console.log(err);
        setMinted(0);
      }).finally(() => {

      });
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  useEffect(() => {
    fetch(env.BACKEND_ORIGIN + '/arts/jsons/' + (nft.index),
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).then(res => {
      res.json().then((resonse) => {
        setNFTDetail(resonse);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
      });
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });
  }, []);

  const toggleShare = () => {
    setShare(!isShare);
  };
  const [isMore, setMore] = useState(false);

  const toggleMore = () => {
    setMore(!isMore);
  };

  useDocumentTitle('Item Details');
  return (
    <div>
      <SiteHeader {...props} />
      <div className="container">
        <Link to="/" className="btn btn-white btn-sm my-40">
          Back to home
        </Link>
        <div className="item_details">
          <div className="row sm:space-y-20">
            <div className="col-lg-6">
              <img
                className="item_img"
                src={`${env.BACKEND_ORIGIN}/arts/images/${nft.index}`}
                alt="ImgPreview"
              />
            </div>
            <div className="col-lg-6">
              <div className="space-y-20">

                <div className="d-flex justify-content-between">
                  <div className="space-x-10 d-flex align-items-center">
                    <h3>{nftDetail?.name}</h3>
                  </div>
                  <div className="space-x-10 d-flex align-items-center">
                    <div>
                      <div className="share">
                        <div className="icon" onClick={toggleShare}>
                          <i className="ri-share-line"></i>
                        </div>
                        <div
                          className={`dropdown__popup ${isShare ? 'visible' : null
                            } `}>
                          <ul className="space-y-10">
                            <li>
                              <a href="https://www.facebook.com/" rel="noreferrer" target="_blank">
                                <i className="ri-facebook-line"></i>
                              </a>
                            </li>
                            <li>
                              <a href="https://www.messenger.com/" rel="noreferrer" target="_blank">
                                <i className="ri-messenger-line"></i>
                              </a>
                            </li>
                            <li>
                              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" >
                                <i className="ri-whatsapp-line"></i>
                              </a>
                            </li>
                            <li>
                              <a href="https://youtube.com" target="_blank" rel="noreferrer" >
                                <i className="ri-youtube-line"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="more">
                        <div className="icon" onClick={toggleMore}>
                          <i className="ri-more-fill"></i>
                        </div>
                        <div
                          className={`dropdown__popup ${isMore ? 'visible' : null
                            } `}>
                          <ul className="space-y-10">
                            <li>
                              <Popup
                                className="custom"
                                ref={ref}
                                trigger={
                                  <Link
                                    to={""}
                                    className="content space-x-10 d-flex">
                                    <i className="ri-flag-line" />
                                    <span> Report </span>
                                  </Link>
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
                                      <div className="space-y-20">
                                        <h5>
                                          Thank you,
                                          <span className="color_green">
                                            we've received your report
                                          </span>
                                        </h5>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popup>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box questions__page space-y-30">
                  <Accordion
                    className="ff"
                    preExpanded={[0, 1, 2, 3]}
                    allowZeroExpanded>
                    <AccordionItem
                      id={0}
                      className="accordion p-10"
                      key={0}
                      uuid={0}>
                      <AccordionItemHeading className="accordion-header p-0">
                        <AccordionItemButton>
                          <button className="accordion-button">
                            {'Level'}
                          </button>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      {/* Accordion Heading */}
                      <AccordionItemPanel>
                        {nft?.index < 10 ? 3 : (nft?.index < 1000 ? 2 : 1)}
                      </AccordionItemPanel>
                      {/* Accordion Body Content */}
                    </AccordionItem>
                    <AccordionItem
                      id={1}
                      className="accordion p-10"
                      key={1}
                      uuid={1}>
                      <AccordionItemHeading className="accordion-header p-0">
                        <AccordionItemButton>
                          <button className="accordion-button">
                            {'Description'}
                          </button>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      {/* Accordion Heading */}
                      <AccordionItemPanel>
                        {nftDetail?.description}
                      </AccordionItemPanel>
                      {/* Accordion Body Content */}
                    </AccordionItem>
                    <AccordionItem
                      id={2}
                      className="accordion p-10"
                      key={2}
                      uuid={2}>
                      <AccordionItemHeading className="accordion-header p-0">
                        <AccordionItemButton>
                          <button className="accordion-button">
                            {'Properties'}
                          </button>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      {/* Accordion Heading */}
                      <AccordionItemPanel>
                        <div className="row mb-30_reset">
                          {nftDetail?.attributes.map((val, i) => (
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-3 mt-3" key={i}>
                              <div className="card__item four mb-1 text-center p-1" style={{ background: 'rgba(21, 178, 229, 0.06)', border: '1px solid rgb(21, 178, 229)', borderRadius: 6 }}>
                                <div className="card_body space-y-10">
                                  {/* =============== */}
                                  <div>
                                    <h6 className="text-primary">{val.trait_type}</h6>
                                  </div>
                                  {/* =============== */}
                                  <h6 className="card_title">{val.value}</h6>

                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionItemPanel>
                      {/* Accordion Body Content */}
                    </AccordionItem>
                    <AccordionItem
                      id={3}
                      className="accordion p-10"
                      key={3}
                      uuid={3}>
                      <AccordionItemHeading className="accordion-header p-0">
                        <AccordionItemButton>
                          <button className="accordion-button">
                            {'Details'}
                          </button>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      {/* Accordion Heading */}
                      <AccordionItemPanel>
                        <div className="row">
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3">
                            Contract Address
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3 text-right">
                            <Link to={{ pathname: props.info.explorer + '/address/' + contract.address }} target="_blank">
                              {contract.address.substring(0, 8) + "..."}
                            </Link>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3">
                            Token ID
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3 text-right">
                            <Link to={{ pathname: props.info.explorer + '/address/' + contract.address }} target="_blank">
                              {nft?.index}
                            </Link>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3">
                            Token Standard
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3 text-right">
                            {props.info.standard}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3">
                            Chain
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-3 text-right text-capitalize">
                            {props.info.chain}
                          </div>
                        </div>
                      </AccordionItemPanel>
                      {/* Accordion Body Content */}
                    </AccordionItem>
                  </Accordion>
                </div>
                {
                  nft?.index < minted && (
                    <Link style={{ minWidth: 130 }} className="btn btn-sm btn-primary" to={{ pathname: 'https://' + props.info.net + '.opensea.io/assets/' + props.info.chain + '/' + contract.address + '/' + nft.index }} target="_blank">
                      Buy
                    </Link>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default ItemDetails;
