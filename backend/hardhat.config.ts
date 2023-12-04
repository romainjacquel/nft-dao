import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";
import "hardhat-gas-reporter";
import "solidity-coverage";

module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		sepolia: {
			url: process.env.SEPOLIA_RPC_URL,
			accounts: [`0x${process.env.PRIVATE_KEY}`],
			chainId: 421614,
			blockConfirmations: 6,
		},
		localhost: {
			url: "http://127.0.0.1:8545",
			chainId: 31337,
		},
	},
	gasReporter: {
		enabled: true,
		currency: "USD",
	},
	sourcify: {
		enabled: false,
	},
	etherscan: {
		apiKey: {
			arbitrumSepolia: process.env.ARBISCAN_API_KEY,
		},
		customChains: [
			{
				network: "arbitrumSepolia",
				chainId: 421614,
				urls: {
					apiURL: "https://sepolia.arbiscan.io/api",
					browserURL: "https://sepolia.arbiscan.io",
				},
			},
		],
	},
	solidity: {
		compilers: [
			{
				version: "0.8.20",
			},
			{
				version: "0.8.7", // For VRFv2Consumer.sol
			},
		],
	},
	optmizer: {
		enabled: true,
	},
};
