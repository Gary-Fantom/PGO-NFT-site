import React from 'react';
import { Link } from 'react-router-dom';
import MetamaskButton from '../MetamaskButton';
const Menu = [
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
function SiteMobileMenu(props) {
    return (
        <div>
            <div className="header__mobile__menu space-y-40">
                <ul className="d-flex space-y-20">
                    {Menu.map((val, i) => (
                        <li key={i}>
                            <Link to={val.link} className="color_black">
                                {val.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="space-y-20">
                    {/* <div className="header__search in_mobile w-full">
                        <input type="text" placeholder="Search" />
                        <button className="header__result">
                            <i className="ri-search-line" />
                        </button>
                    </div> */}
                    <MetamaskButton {...props} />
                </div>
            </div>
        </div>
    );
}

export default SiteMobileMenu;
