import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
    "0x3C493390765aEe7Ab559b2fC160B20B7aBBF95F9",
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();

        // Conditions of nft drop
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuanity: 50_000,
            maxQuanityPerTransaction: 1,
        });

        await bundleDrop.setClaimCondition(0, claimConditionFactory); // The 0 is for the 0th (index, so first/1st) nft in this contract, which is the base membership NFT
        console.log("🏔 Successfully set claim condition on bundle drop:", bundleDrop.address);
    } catch (error) {
        console.error("Failed to set claim condition. Error:", error);
    }
})()