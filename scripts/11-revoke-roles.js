import sdk from "./1-initialize-sdk.js"

const tokenModule = sdk.getTokenModule(
    "0x8f3ad85fB4E36fdf0F1ED14b27649C898D894D24",
);

(async () => {
    try {
        // Log the current roles
        console.log("Roles that exist right now: ", await tokenModule.getAllRoleMembers());

        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "🎉 Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console.log("✅ Successfully revoked our superpowers admin rights from the contract");

    } catch (error) {
        console.error("Failed to remove admin powers, error: ", error);
    }
})();