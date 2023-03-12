import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetamaskButton from '../MetamaskButton';

function SiteMobileMenu(props) {

    const [Menu, setMenu] = useState([]);

    useEffect(() => {
        if (props.status === 'connected' && props.chainId === props.networks[props.info.chain]) {
            setMenu([
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
                {
                    title: ' Swap',
                    link: '/swap',
                }
            ]);
        } else {
            setMenu([
                {
                    title: 'Home',
                    link: '/',
                },
                {
                    title: 'Marketplace',
                    link: '/marketplace',
                },
                {
                    title: ' Swap',
                    link: '/swap',
                }
            ]);
        }
    }, [props.status, props.chainId]);

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
