import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
    "0x8f3ad85fB4E36fdf0F1ED14b27649C898D894D24",
);

(async () => {
    try {
        const amount = 1_000_000;
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        // How many of these tokens are existing now
        console.log(
            "🕹 There are now",
            ethers.utils.formatUnits(totalSupply, 18),
            "$KGN in circulation",
        );
    } catch (error) {
        console.error("Failed to print money, error:", error);
    }
})();