import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SiteFooter from "../../../components/footer/SiteFooter";
import SiteHeader from "../../../components/header/SiteHeader";
import pengolinSwapContract from '../../../contract/pengolinswap.json';
import env from "react-dotenv";
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { ethers } from 'ethers';
import Popup from "reactjs-popup";
import { useRef } from "react";

let rejected = false;

const Swap = (props) => {

    const ref = useRef();
    const closeTooltip = () => ref.current.close();

    const [txHash, setTxHash] = useState("");
    const [txAmount, setTxAmount] = useState("");

    const [signature, setSignature] = useState("");

    const [chainId, setChainId] = useState("");
    const [status, setStatus] = useState(props.status);

    // -1: not started, 0: started, 1: in swap, 2: finish
    const [swapStatus, setSwapStatus] = useState(-1);

    const [errSignature, setErrSignature] = useState("");
    const [errSwap, setErrSwap] = useState("");

    const connectWalllet = async () => {
        if (props.status === "notConnected") {
            if (props.connect && props.switchChain) {
                try {
                    await props.switchChain(props.networks[props.info.chain]);
                    await props.connect()
                } catch (error) {
                    console.log(error);
                    rejected = true;
                    toast.error(
                        <div>
                            <span>{"Connect Wallet to Mint!"}</span>
                        </div>,
                        { position: toast.POSITION.TOP_RIGHT }
                    );
                }
            }
        }
    };

    const swap = () => {
        const splitted = ethers.utils.splitSignature(signature);
        const { ethereum } = window;
        if (ethereum && props.account) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const swapContract = new ethers.Contract(pengolinSwapContract.address, pengolinSwapContract.abi, signer);

            swapContract.swap(txHash, ethers.utils.parseEther(txAmount, 'ether'), splitted.v, splitted.r, splitted.s).then((res) => {
                console.log(res);
                setSwapStatus(2);
            }).catch(fetchError);
        }
    }

    useEffect(() => {
        setStatus(props.status);
        setChainId(props.chainId);
        if (rejected) {
            return;
        }
        connectWalllet();
    }, [props.status, props.chainId]);

    useEffect(() => {
        if (signature) {
            swap();
        }
    }, [signature]);

    const copyToClipboard = (signature) => {
        navigator.clipboard.writeText(signature);
        setTimeout(() => {
            toast.success(
                'Copied',
                { position: toast.POSITION.TOP_RIGHT }
            );
        }, 100);
    };

    const requestSignature = () => {

        setSwapStatus(0);
        setErrSignature('');
        setSignature('');
        setErrSwap('');
        fetch(env.BACKEND_ORIGIN + '/signature/' + (txHash) + '/' + (txAmount),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(function (response) {
            return response.json();
        }).then((res) => {
            if (res.success) {
                setSignature(res.msg);
            } else {
                setErrSignature(res.msg);
                toast.error(
                    <div onClick={() => copyToClipboard(res.msg)}>
                        <span>{res.msg}
                        </span>
                    </div>,
                    { position: toast.POSITION.TOP_RIGHT }
                );
            }
        }).catch((err) => {
            console.log(err);
            setErrSignature(err);
            toast.error(
                err,
                { position: toast.POSITION.TOP_RIGHT }
            );
        }).finally(() => {
            setSwapStatus(1);
        });
    }

    const initSignature = () => {
        setSwapStatus(-1);
        setSignature('');
        setErrSignature('');
        setErrSwap('');
    }

    const fetchError = (err) => {
        setSwapStatus(2);

        let msg = "";
        if (err.message.indexOf('ALREADY_USED') > -1) {
            msg = 'ALREADY_USED';
        } else if (err.message.indexOf('WRONG_SIGNATURE') > -1) {
            msg = 'WRONG_SIGNATURE';
        }
        setErrSwap(msg);
    }

    const verifyMessage = ((message, sig) => {
        try {
            const signerAddr = ethers.utils.verifyMessage(message, sig);
        } catch (err) {
            console.log(err);
        }
    });

    const isSwapAvailable = () => {
        return status === 'connected' && chainId === props.networks[props.info.chain];
    }

    const isSwapping = () => {
        if (isSwapAvailable()) {
            if (swapStatus === -1 || swapStatus === 2 || (swapStatus === 1 && errSignature)) {
                return false;
            } else {
                return true;
            }
        } else {
            if (swapStatus == 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    return (
        <div>
            <SiteHeader {...props} />
            <div
                className="hero_marketplace bg_white"
                style={{ padding: "50px 0" }}
            >
                <div className="container">
                    <h1 className="text-center">Swap</h1>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="mt-5 box edit_box space-y-20 col-lg-6">
                    <div className="space-y-10">
                        <span className="nameInput">Transaction Hash </span>
                        <div className="confirm">
                            <input
                                type="text"
                                value={txHash}
                                onChange={(e) => {
                                    setTxHash(e.target.value);
                                }}
                                className="form-control"
                                placeholder="Enter Transaction Hash"
                            />
                        </div>
                    </div>
                    <div className="space-y-10">
                        <span className="nameInput">Transaction Amount </span>
                        <div className="confirm">
                            <input
                                type="number"
                                value={txAmount}
                                onChange={(e) => {
                                    setTxAmount(e.target.value);
                                }}
                                className="form-control"
                                placeholder="Enter Transaction Amount"
                            />
                        </div>
                    </div>
                    <Popup
                        onClose={() => {
                            initSignature();
                        }}
                        className="custom"
                        ref={ref}
                        trigger={
                            <button
                                disabled={!txHash || !txAmount || isSwapping()}
                                className="btn btn-grad w-full btn-lg">
                                {isSwapAvailable() ? 'Swap' : 'Request Signature'}
                            </button>
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
                                    <div>
                                        <p className="d-flex align-items-center">
                                            <span className="pr-4">
                                                {
                                                    swapStatus === -1 && (
                                                        1
                                                    )
                                                }
                                                {
                                                    swapStatus === 0 && (
                                                        <span style={{width: 16, height: 16}} className="spinner-border text-primary"></span>
                                                    )
                                                }
                                                {
                                                    (swapStatus === 1 || swapStatus === 2) && signature && (
                                                        <i className="text-success ri-checkbox-circle-line"></i>
                                                    )
                                                }
                                                {
                                                    (swapStatus === 1 || swapStatus === 2) && errSignature && (
                                                        <i className="text-danger ri-error-warning-fill"></i>
                                                    )
                                                }
                                            </span>
                                            <span>Generate Signature</span>
                                        </p>
                                        <div style={{ position: 'relative', minHeight: 60 }}>
                                            {signature && (
                                                <div
                                                    className="text-success d-flex align-items-center ml-4"
                                                >
                                                    <span>
                                                        {signature.substring(0, 10) +
                                                            "..." +
                                                            signature.substring(
                                                                signature.length - 3,
                                                                signature.length
                                                            )}
                                                    </span>
                                                </div>
                                            )}
                                            {errSignature && (
                                                <div
                                                    className="text-danger d-flex align-items-center ml-4"
                                                >
                                                    <span>
                                                        {errSignature}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="gradient-border" style={{ position: 'absolute', top: 5, left: 0, bottom: 5, minHeight: 50 }}></div>
                                        </div>
                                        {
                                            isSwapAvailable() && (
                                                <div className="mb-4">
                                                    <p className="d-flex align-items-center">
                                                        <span className="pr-4">
                                                            {
                                                                (swapStatus === 2) && errSwap && (
                                                                    <i className="text-danger ri-error-warning-fill"></i>
                                                                )
                                                            }
                                                            {
                                                                (swapStatus === 2) && !errSwap && (
                                                                    <i className="text-success ri-checkbox-circle-line"></i>
                                                                )
                                                            }
                                                            {
                                                                (swapStatus === 1) && (
                                                                    <span style={{width: 16, height: 16}} className="spinner-border text-primary"></span>
                                                                )
                                                            }
                                                            {
                                                                (swapStatus === -1 || swapStatus === 0) && (
                                                                    2
                                                                )
                                                            }
                                                        </span>
                                                        <span>Swap</span>
                                                    </p>
                                                    <div>
                                                        {errSwap && (
                                                            <div
                                                                className="text-danger d-flex align-items-center ml-4"
                                                            >
                                                                <span>
                                                                    {errSwap}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <button onClick={requestSignature} className="btn btn-primary w-full" disabled={isSwapping()}>
                                        Start
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Popup>

                    <div className="space-y-20 questions__page">
                        <Accordion className="ff" preExpanded={["b"]} allowZeroExpanded>
                            <AccordionItem
                                id={"description"}
                                className="accordion p-30 mb-20"
                                key={0}
                                uuid={"description"}
                            >
                                <AccordionItemHeading className="accordion-header p-0">
                                    <AccordionItemButton>
                                        <button className="accordion-button">
                                            {"Description"}
                                        </button>
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                {/* Accordion Heading */}
                                <AccordionItemPanel>
                                    <p className="accordion-desc">
                                        {
                                            "The signature is used as a parameter to verify the PGO transaction in the swap smart contract, which mints new PGO ERC20 tokens at a 1/100 ratio of the amount of old PGO to the caller`s address."
                                        }
                                    </p>
                                    <p className="accordion-desc">
                                        {
                                            "There are two important pieces of information regarding transactions:"
                                        }
                                    </p>
                                    <p className="accordion-desc">
                                        {
                                            "1. Transaction Hash: This is the hash of the transaction sent to the developer`s address."
                                        }
                                    </p>
                                    <p className="accordion-desc">
                                        {
                                            "2. Transaction Amount: This is the amount sent to the developer's address."
                                        }
                                    </p>
                                </AccordionItemPanel>
                                {/* Accordion Body Content */}
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>

            <SiteFooter {...props} />
        </div>
    );
};

export default Swap;