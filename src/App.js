import "./assets/css/plugins/bootstrap.min.css";
import 'remixicon/fonts/remixicon.css'
import "./assets/scss/style.scss";
import "./assets/scss/custom.scss";
import { useMetaMask, useConnectedMetaMask } from 'metamask-react';
import Router from "./Router/routes";
import React from "react";
import env from "react-dotenv";

function ConnectedApp(props) {
  const { account, chainId } = useConnectedMetaMask();

  return (
    <React.StrictMode>
      <div className="App overflow-hidden">
        <Router account={account} chainId={chainId} {...props} />
      </div>
    </React.StrictMode>
  );
}

function App() {

  const networks = {
    mainnet: "0x1", // 1
    // Test nets
    goerli: "0x5", // 5
    ropsten: "0x3", // 3
    rinkeby: "0x4", // 4
    kovan: "0x2a", // 42
    mumbai: "0x13881", // 80001
    // Layers 2
    arbitrum: "0xa4b1", // 42161
    optimism: "0xa", // 10
    // Side chains
    polygon: "0x89", // 137
    gnosisChain: "0x64", // 100
    // Alt layer 1
    binanceSmartChain: "0x38", // 56
    avalanche: "0xa86a", // 43114
    cronos: "0x19", // 25
    fantom: "0xfa" // 250
  }

  const TOKENINFO = {
    chain: env.CHAIN,
    standard: env.STANDARD,
    fee: env.FEE,
    net: env.NET,
    explorer: env.EXPLORER
  };

  const { status, connect, switchChain, addChain } = useMetaMask();

  if (status === "initializing" || status === "unavailable" || status === "notConnected" || status === "connecting") {
    return (
      <React.StrictMode>
        <div className="App overflow-hidden">
          <Router networks={networks} info={TOKENINFO} status={status} connect={connect} switchChain={switchChain} addChain={addChain} />
        </div>
      </React.StrictMode>
    );
  }

  return <ConnectedApp networks={networks} info={TOKENINFO} switchChain={switchChain} addChain={addChain} status={status} />
}

export default App;
