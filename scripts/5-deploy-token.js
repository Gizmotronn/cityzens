import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xB3883F5D971C54c1D7137F423c717b1b97F983f2");

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      name: "Kinetika Governance Token",
      symbol: "KGN",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})()