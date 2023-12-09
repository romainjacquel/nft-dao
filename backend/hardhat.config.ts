import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";
import {} from "hardhat";
import "hardhat-gas-reporter";
import { task } from "hardhat/config";
import "solidity-coverage";

task("setBaseUri", "Set the baseURI of the NFT contract")
	.addParam("uri", "The new baseURI")
	.addParam("address", "The contract address")
	.setAction(async ({ uri, address }, hre) => {
		try {
			const nft = await hre.ethers.getContractAt("NFT", address);

			await nft.setBaseURI(uri);

			const baseURI = await nft.baseURI();

			// biome-ignore lint/suspicious/noConsoleLog: Usefull log
			console.log("baseURI", baseURI);
		} catch {
			// biome-ignore lint/suspicious/noConsoleLog: Usefull log
			console.log("task failed");
		}
	});

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
