import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0x2E34df2F0CB84213A904677086958C1DAdcB520c",
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Pulsing Steam Gizmo", // lore -> gizmos (currency-like in game, different types/classes referring to different areas of life/tribes/whatever)
                description: "This NFT will give you access to Signal Kinetic's CityDAO!",
                image: readFileSync("scripts/assets/steam-gizmo.png"),
            },
        ]);
        console.log("👋 Successfully created a new NFT in the drop!");
    } catch (error) {
        console.log("failed to create the new NFT. Error:", error);
    }
})()