import { useEffect, useMemo, useState } from "react";
// import thirdweb
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";

const sdk = new ThirdwebSDK("rinkeby"); // Instantiating the sdk on eth->rinkeby network

const bundleDropModule = sdk.getBundleDropModule(
  "0x3C493390765aEe7Ab559b2fC160B20B7aBBF95F9",
);

const App = () => {
  // Use the connectWallet hook thirdweb provides
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

  // Another useEffect!
  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return; // If we don't have an address, don't do anything
    }

    // Check if the user has the NFT
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("☃️ This user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("☹️ This user doesn't yet have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("Failed to NFT balance, error:", error);
      });
  }, [address]);

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

  if(hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>👋 Member section</h1>
        <p>Congratulations on being a valued member! 💕</p>
      </div>
    );
  };

  const mintNFT = () => {
    setIsClaiming(true);
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("failed to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      setIsClaiming(false); // Stops the loading state
      setHasClaimedNFT(true);
      console.log(
        "🖇 Successfully minted! Check opensea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0"
      );
    });
  }

  // Mint NFT screen/window component/area
  return (
    <div className="mint-nft">
    <button
      disabled={isClaiming}
      onClick={() => mintNFT()}
    >
      {isClaiming ? "Minting..." : "Mint NFT"}
    </button>
    </div>
  );

  //If the user has connected their wallet
  return (
    <div className="landing">
      <h1>👀 wallet connected!</h1>
    </div>);
};

export default App;