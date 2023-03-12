import { Link } from 'react-router-dom';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function SiteFooter(props) {

  const [status, setStatus] = useState('');
  const [chainId, setChainId] = useState('');

  useEffect(() => {
    setStatus(props.status);
    setChainId(props.chainId);
  }, [props.status, props.chainId]);

  return (
    <div>
      <footer className="footer__1">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 space-y-20">
              <div className="footer__logo">
                <Link to="/">
                  <img src={`img/logos/Logo.svg`} alt="logo" id="logo_js_f" />
                </Link>
              </div>
              <p className="footer__text">
                PGO-NFT is a ERC721 NFT for our own P2E games.
              </p>
              <div>
                <ul className="footer__social space-x-10 mb-40">
                  <li>
                    <a href="https://www.facebook.com/" rel="noreferrer" target="_blank">
                      <i className="ri-facebook-line" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.messenger.com/" rel="noreferrer" target="_blank">
                      <i className="ri-messenger-line" />
                    </a>
                  </li>
                  <li>
                    <a href="https://whatsapp.com" target="_blank" rel="noreferrer" >
                      <i className="ri-whatsapp-line" />
                    </a>
                  </li>
                  <li>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" >
                      <i className="ri-youtube-line" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-6">
              <h6 className="footer__title">Company</h6>
              <ul className="footer__list">
                {/* <li>
                  <Link to="connect-wallet"> Connect wallet</Link>
                </li> */}
              </ul>
            </div>
            <div className="col-lg-2 col-6">
              <h6 className="footer__title">PGO-NFT</h6>
              <ul className="footer__list">
                <li>
                  <Link to="/"> Home</Link>
                </li>
                <li>
                  <Link to="marketplace"> Marketplace</Link>
                </li>
                <li>
                  <Link to="swap"> Swap</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-6">
              <h6 className="footer__title">Assets</h6>
              <ul className="footer__list">
                {
                  status === 'connected' && chainId === props.networks[props.info.chain] && (
                    <li>
                      <Link to="wallet"> Wallet </Link>
                    </li>
                  )
                }
              </ul>
            </div>

          </div>
          <p className="copyright text-center">
            Copyright © 2021. Created with love by creabik.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SiteFooter;
