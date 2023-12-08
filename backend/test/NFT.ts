import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import { ethers } from "hardhat";
import { describe, it } from "mocha";

async function deployVotingContract() {
	const [owner, addr1, addr2] = await ethers.getSigners();

	const _NFT = await ethers.getContractFactory("NFT");
	const NFT = await _NFT.deploy();

	return { NFT, owner, addr1, addr2 };
}

describe("NFT", () => {
	describe("Deploy", () => {
		it("should set the owner to the right owner", async () => {
			const { NFT, owner } = await loadFixture(deployVotingContract);

			expect(await NFT.owner()).to.equal(owner.address);
		});
	});

	describe("setBaseURI", () => {
		it("should set the baseURI", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await NFT.setBaseURI("ipfs://CID/");
			expect(await NFT.baseURI()).to.equal("ipfs://CID/");
		});
	});

	// describe("mint", () => {});

	// describe("tokenURI", () => {
	// 	it("should return the tokenURI", async () => {
	// 		const { NFT } = await loadFixture(deployVotingContract);

	// 		await NFT.setBaseURI("ipfs://CID/");
	// 		expect(await NFT.tokenURI(1)).to.equal("ipfs://CID/1.json");
	// 	});
	// });
});

describe("Bidding", () => {
	describe("Deploy", () => {
		it("should set the right bidding status", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			expect(await NFT.biddingStatus()).to.equal(0);
		});
		it("should set the right bidding duration", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			expect(await NFT.biddingDuration()).to.equal(3);
		});
		it("should set the right delay between biddings", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			expect(await NFT.delayBetweenBiddings()).to.equal(120);
		});
		it("should set the right minimum bid amount", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			expect(await NFT.minBidAmount()).to.equal(parseEther("0.02"));
		});
	});

	describe("SetBidding", () => {
		it("should set a new winner", async () => {
			const { NFT, addr1 } = await loadFixture(deployVotingContract);

			await expect(NFT.connect(addr1).setBidding({ value: parseEther("0.02") })).to.emit(NFT, "SetBiddingWin");
		});

		it("should not set a new winner", async () => {
			const { NFT, addr1 } = await loadFixture(deployVotingContract);

			await NFT.connect(addr1).setBidding({ value: parseEther("0.03") });

			await expect(NFT.setBidding({ value: parseEther("0.02") })).to.emit(NFT, "SetBiddingLose");
		});

		it("should revert with => amount too low", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await expect(NFT.setBidding({ value: parseEther("0.01") })).to.be.revertedWith("Bid amount is too low");
		});

		it("should revert with => your bid is alreay winning", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await NFT.setBidding({ value: parseEther("0.03") });

			await expect(NFT.setBidding({ value: parseEther("0.04") })).to.be.revertedWith("Your bid is already winning");
		});
	});

	describe("checkUpkeep", () => {
		it("should return true and 0 when bidding status is OPEN", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			const [upkeepNeeded] = await NFT.checkUpkeep("0x");
			expect(upkeepNeeded).to.equal(true);
		});
	});

	describe("performUpkeep", () => {
		it("should revert => Bidding is still closed", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			const [, performData] = await NFT.checkUpkeep("0x");
			await expect(NFT.performUpkeep(performData)).to.be.revertedWith("Bidding is still closed");
		});
	});
});
