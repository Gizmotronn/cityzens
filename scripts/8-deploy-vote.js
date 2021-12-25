import sdk from "./1-initialize-sdk.js";

// Grab app module address.
const appModule = sdk.getAppModule(
    "0xB3883F5D971C54c1D7137F423c717b1b97F983f2",
);

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            name: "City of Kinetika Proposals",
            votingTokenAddress: "0x8f3ad85fB4E36fdf0F1ED14b27649C898D894D24",
            
            proposalStartWaitTimeInSeconds: 0, // Allows users to vote on proposals immediately after the proposal is created
            proposalVotingTimeInSeconds: 24 * 60 * 60, // 24 hours (in seconds, 86400)

            votingQuorumFraction: 0, // Minimum percentage of users that need to vote for proposal to be valid after the time period elapses

            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log(
            "🚀 Successfully deployed vote module, address:",
            voteModule.address,
        );
    } catch (err) {
        console.log("Failed to deploy vote module, error:", err);
    }
})();