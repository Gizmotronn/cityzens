import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Address to the ERC-1155 membership NFT contract
const bundleDropModule = sdk.getBundleDropModule(
    "0x3C493390765aEe7Ab559b2fC160B20B7aBBF95F9",
);

// Address to the ERC-20 token contract
const tokenModule = sdk.getTokenModule(
    "0x8f3ad85fB4E36fdf0F1ED14b27649C898D894D24",
);

(async () => {
    try {
        // Grab all the addresses of people who own our membership NFT
        const walletAddress = await bundleDropModule.getAllClaimerAddresses("0");

        if (walletAddress.length === 0) {
            console.log(
                "No NFTs have been claimed yet :(",
            );
            process.exit(0);
        }

        // Loop through the array of addresses.
        const airdropTargets = walletAddress.map((address) => {
            // pick a random # between 1000 and 10000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("🎥 Going to airdrop", randomAmount, "tokens to", address);

            // Set up the rarget
            const airdropTarget = {
                address,
                amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
            };

            return airdropTarget;
        });

        // Call transferBatch on all our airdrop targets.
        console.log("🌈 Starting airdrop...")
        await tokenModule.transferBatch(airdropTargets)
        console.log("⛏ Successfully airdropped tokens to all the holders of the NFT!");
    } catch (err) {
        console.error("Failed to airdrop tokens, error:", err);
    }
})();