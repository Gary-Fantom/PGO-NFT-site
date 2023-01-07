import { Link } from 'react-router-dom';
import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const MetamaskButton = (props) => {
    const ref = useRef();
    const closeTooltip = () => ref.current.close()

    const [status, setStatus] = useState(props.status ? props.status : null);
    const [account, setAccount] = useState(props.account ? props.account : null);
    const [chainId, setChainId] = useState(props.chainId ? props.chainId : null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setStatus(props.status);
        setAccount(props.account);
        setChainId(props.chainId);
    }, [
        props.status, props.connect, props.account, props.chainId
    ]);

    const copyToClipboard = (account) => {
        navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => { setCopied(false) }, 1000);
    };

    const renderMetamaskButton = () => {
        
        switch (status) {
            case "initializing":
                return (
                    <div className="btn btn-grad btn-sm">
                        <i className="ri-wallet-3-line" />
                        Initializing...
                    </div>
                );
            case "unavailable":
                return (
                    <Popup
                        className="custom"
                        ref={ref}
                        trigger={
                            <div className="btn btn-grad btn-sm">
                                <i className="ri-wallet-3-line" />
                                Connect wallet
                            </div>
                        }
                        position="bottom center">
                        <div>
                            <div
                                className="popup"
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
                                            Metamask is unavailable!
                                        </h3>
                                        <Link
                                            to={{ pathname: "https://metamask.io/download/" }}
                                            className="btn btn-dark w-full" target="_blank">
                                            Install Metamask
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popup>
                );
            case "notConnected":

                break;
            case "connecting":
                return (
                    <div className="btn btn-grad btn-sm">
                        <i className="ri-wallet-3-line" />
                        Connecting...
                    </div>
                );
            case "connected":
                if (props.networks && chainId !== props.networks[props.info.chain]) {
                    return (
                        <div className="btn btn-grad btn-sm" style={{ minWidth: 130 }} onClick={() => switchNetwork()}>
                            <i className="ri-wallet-3-line" />
                            <span>{"Wrong NetWork"}</span>
                        </div>
                    );
                }
                return (
                    <div className="btn btn-grad btn-sm" onClick={() => copyToClipboard(account)} style={{ minWidth: 130 }}>
                        <i className="ri-wallet-3-line" />
                        {copied && (
                            <span><i className="ri-check-line"></i>Copied</span>
                        )}
                        {!copied && (
                            <span>{account.substring(0, 8) + "..."}
                            </span>
                        )}
                    </div>
                );
            default:
                break;
        }

        return (
            <div className="btn btn-grad btn-sm" onClick={() => connectWalllet()}>
                <i className="ri-wallet-3-line" />
                Connect wallet
            </div>
        );
    }

    const switchNetwork = async () => {
        if (props.switchChain) {
            try {
                await props.switchChain(props.networks[props.info.chain]);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const connectWalllet = async () => {
        if (status === "notConnected") {
            if (props.connect && props.switchChain) {
                try {
                    await props.switchChain(props.networks[props.info.chain]);
                    props.connect();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    return renderMetamaskButton();
};

export default MetamaskButton;
