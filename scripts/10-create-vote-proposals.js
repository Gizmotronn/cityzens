import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Voting contract
const voteModule = sdk.getVoteModule(
    "0x57fcEeE588D7AC15505519d8d17d0F9bFB7aC0dA",
);

// Token contract
const tokenModule = sdk.getTokenModule(
    "0x8f3ad85fB4E36fdf0F1ED14b27649C898D894D24",
);

(async () => {
    try {
        const amount = 420_000;

        // Create proposal to mint `amount` variable (^^ above) to the treasury
        await voteModule.propose(
            "Should the DAO mint an additional " + amount + " tokens into the treasury?",
            [
                {
                    nativeTokenValue: 0, // The amount of eth we're sending (nativeTokenValue) is 0, as we're just minting new tokens
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // Minting to the voteModule (which acts as the treasury)
                        "mint",
                        [
                            voteModule.address,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    toAddress: tokenModule.address, // The module executes the mint
                },
            ]
        );

        console.log("Created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal, error:", error);
        process.exit(1);
    }

    try {
        const amount = 6_900;

        // New proposal to transfer from treasury to ourselves
        await voteModule.propose(
            "Should the Cityzens transfer " + amount + " tokens from the treasury to " + process.env.WALLET_ADDRESS + "?",
            [
                {
                    nativeTokenValue: 0, // We're sending ourselves 0 ETH, just our own token
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        "transfer",
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),

                    toAddress: tokenModule.address,
                },
            ]
        );

        console.log("Successfully created proposal #2");
    } catch (error) {
        console.error("failed to create #2 proposal, error: ", error);
    }
})();