import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xB3883F5D971C54c1D7137F423c717b1b97F983f2");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            name: "Cityzens Membership", // Name of the collection
            description: "A DAO for gaming Cityzens",
            image: readFileSync("scripts/assets/header.jpg"), // Header for the collection
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log(
            "💕 Successfully deployed bundleDrop module, address:",
            bundleDropModule.address,
        );
        console.log(
            "💬 bundleDrop metadata:",
            await bundleDropModule.getMetadata(),
        );
    } catch (error) {
        console.log("failed to deploy bundleDrop module, error", error);
    }
})()