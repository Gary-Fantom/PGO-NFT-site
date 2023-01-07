import {Link} from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
import MetamaskButton from './MetamaskButton';
import SiteMobileMenu from './Menu/SiteMobileMenu';

const PagesMenu = [
    {
        title: 'Home',
        link: '/',
    },
    {
        title: 'Marketplace',
        link: '/marketplace',
    },    
    {
        title: ' Wallet',
        link: '/wallet',
    },
];

const SiteHeader = (props) => {
  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  return (
    <div>

      <header className="header__1">
        <div className="container">
          <div className="wrapper js-header-wrapper">
            <div className="header__logo">
              <Link to="/">
                <img
                  className="header__logo"
                  id="logo_js"
                  src="img/logos/Logo.svg"
                  alt="logo"
                />
              </Link>
            </div>
            {/* ==================  */}
            <div className="header__menu">
              <ul className="d-flex space-x-20">
                {PagesMenu.map((val, i) => (
                  <li key={i}>
                    <Link className="color_black" to={val.link}>
                      {val.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* ================= */}
            {/* <div className="header__search">
              <input type="text" placeholder="Search" />
              <Link to="no-results" className="header__result">
                <i className="ri-search-line" />
              </Link>
            </div> */}
            <div className="header__btns">
              <MetamaskButton {...props} />
            </div>
            <div className="header__burger js-header-burger" onClick={toggleClass}/>
            <div className={` header__mobile js-header-mobile  ${isActive ? 'visible': null} `}>
            <SiteMobileMenu {...props} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default SiteHeader;
