import { useEffect, useMemo, useState } from "react";
// import thirdweb
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { ethers } from "ethers";

const sdk = new ThirdwebSDK("rinkeby"); // Instantiating the sdk on eth->rinkeby network

// Address to the erc-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x3C493390765aEe7Ab559b2fC160B20B7aBBF95F9",
);

// Address to the ERC-20 token contract
const tokenModule = sdk.getTokenModule(
  "0x8f3ad85fB4E36fdf0F1ED14b27649C898D894D24",
);

const App = () => {
  // Use the connectWallet hook thirdweb provides
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // Array holding all our members' addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Shorten the wallet address
  const shortenAddress = (str) => {
    return str.subtring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // Grabs all the members' addresses from the contract, showing who holds/owns our NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses)
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("failed to get member list, error:", err);
      });
  }, [hasClaimedNFT]);

  // Grabs all the members' token amounts from the contract, showing how many tokens each member has
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("🔐 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get member list, error:", err);
      })
  }, [hasClaimedNFT]);

  // Combine both memberAddresses & memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
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

  if (error && error.name === "UnsupportedChainIdError") {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on Rinkeby test network
        </p>
      </div>
    );
  }

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

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🍪Cityzens Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="mint-nft">
      <h1>Mint your free Cityzens Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => {
          setIsClaiming(true);
          // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
          bundleDropModule
            .claim("0", 1)
            .catch((err) => {
              console.error("failed to claim", err);
              setIsClaiming(false);
            })
            .finally(() => {
              // Stop loading state.
              setIsClaiming(false);
              // Set claim state.
              setHasClaimedNFT(true);
              // Show user their fancy new NFT!
              console.log(
                `Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
              );
            });
        }}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;