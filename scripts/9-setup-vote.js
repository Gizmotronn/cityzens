import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const voteModule = sdk.getVoteModule( // Governance smart contract
    "0x57fcEeE588D7AC15505519d8d17d0F9bFB7aC0dA",
);

const tokenModule = sdk.getTokenModule( // ERC-20 contract
    "0x8f3ad85fB4E36fdf0F1ED14b27649C898D894D24",
);

(async () => {
    try {
        // Allow the treasury the power to mint additional tokens if needed
        await tokenModule.grantRole("minter", voteModule.address);

        console.log("Vote module permissions to act on token module -> granted!");
    } catch (error) {
        console.error(
            "failed to grant permissions, error:", error
        );
        process.exit(1)
    }

    try {
        const ownedTokenBalance = await tokenModule.balanceOf( // Grabs our token balance
            process.env.WALLET_ADDRESS
        );

        // Grab 90% of the supply we hold
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent90 = ownedAmount.div(100).mul(90);

        // Transfer 90% to voting contract
        await tokenModule.transfer(
            voteModule.address,
            percent90
        );

        console.log("🔫 Tokens have been transferred to vote module");
    } catch (err) {
        console.error("failed to transfer tokens to vote module, error:", err);
    }
})();