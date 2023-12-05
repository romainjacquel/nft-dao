import { ethers } from "hardhat";

async function main() {
	const bidding = await ethers.deployContract("Bidding", [1, 10, 1]);

	// Voir pour faire un script qui feed mon contrat (le script est mandatory pour la certification)

	await bidding.waitForDeployment();

	// biome-ignore lint/suspicious/noConsoleLog: usefull for debugging
	console.log(`Bidding deployed to ${bidding.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
