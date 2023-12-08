import { ethers } from "hardhat";

const setBaseURI = async () => {
	// const args = process.argv.slice(2);

	// console.log(args);

	const nft = await ethers.getContractAt("NFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

	await nft.setBaseURI("https://ipfs.io/ipfs/");

	const baseURI = await nft.baseURI();
	console.log(ethers.utils.toUtf8String(baseURI));

	// biome-ignore lint/suspicious/noConsoleLog: usefull for debugging
	//console.log(`Base uri is now: ${}}`);
};

setBaseURI()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
