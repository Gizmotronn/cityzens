import { useEffect, useMemo, useState } from "react";
// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // Use the connectWallet hook thirdweb provides
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // If the user hasn't connected their wallet, call connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to CityDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // If the user has connected their wallet
  return (
    <div className="landing">
      <h1>👀 wallet connected!</h1>
    </div>);
};

export default App;