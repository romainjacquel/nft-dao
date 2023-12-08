import { time } from "@nomicfoundation/hardhat-network-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import { ethers } from "hardhat";
import { describe, it } from "mocha";

const BIDDING_TIME = 3 * 60; // in secondes
const CLOSED_BIDDING_TIME = 120; // in secondes

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

	describe("mint", () => {
		it("should revert with => Bidding still open", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await expect(NFT.mint(1)).to.be.revertedWith("Bidding still open");
		});

		it("should revert with => You are not a winner", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await expect(NFT.mint(1)).to.be.revertedWith("You are not a winner");
		});

		it("should mint one NFT", async () => {
			const { NFT, owner } = await loadFixture(deployVotingContract);
			await NFT.setBidding({ value: parseEther("0.03") });
			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await NFT.mint(1);

			expect(await NFT.balanceOf(owner.address)).to.equal(1);
		});

		it("should emit event => Mint", async () => {
			const { NFT } = await loadFixture(deployVotingContract);
			await NFT.setBidding({ value: parseEther("0.03") });
			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			expect(await NFT.mint(1)).to.emit(NFT, "Mint");
		});

		it("should revert => Too many NFTs in your wallet", async () => {
			const { NFT } = await loadFixture(deployVotingContract);
			await NFT.setBidding({ value: parseEther("0.03") });

			await time.increase(180);
			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await NFT.mint(1);

			await time.increase(CLOSED_BIDDING_TIME);
			const [, _performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(_performData);

			await NFT.setBidding({ value: parseEther("0.03") });

			await time.increase(180);
			const [, data] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(data);

			await NFT.mint(1);

			await time.increase(CLOSED_BIDDING_TIME);
			const [, _data] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(_data);

			await NFT.setBidding({ value: parseEther("0.03") });

			await time.increase(180);
			const [, d] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(d);

			await expect(NFT.mint(1)).to.be.revertedWith("Too many NFTs in your wallet");
		});
	});

	describe("tokenURI", () => {
		it("should return the tokenURI", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await NFT.setBidding({ value: parseEther("0.03") });
			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await NFT.mint(1);

			await NFT.setBaseURI("ipfs://CID/");
			expect(await NFT.tokenURI(0)).to.equal("ipfs://CID/0.json");
		});

		it("should revert => Token not found", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await NFT.setBidding({ value: parseEther("0.03") });
			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await NFT.mint(1);

			await NFT.setBaseURI("ipfs://CID/");
			await expect(NFT.tokenURI(1)).to.revertedWith("Token not found");
		});
	});

	describe("withdraw", () => {
		it("should revert => You are not the owner", async () => {
			const { NFT, addr1 } = await loadFixture(deployVotingContract);

			await expect(NFT.connect(addr1).withdraw()).to.be.revertedWithCustomError(NFT, "OwnableUnauthorizedAccount");
		});

		it("should withdraw the balance to the contract owner", async () => {
			const { NFT, owner, addr1 } = await loadFixture(deployVotingContract);
			await NFT.connect(addr1).setBidding({ value: parseEther("1") });
			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await NFT.withdraw();

			expect(await ethers.provider.getBalance(owner.address)).to.be.greaterThan(0);
		});
	});
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

		it("should revert with => bidding is closed", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await expect(NFT.setBidding({ value: parseEther("0.04") })).to.be.revertedWith("Bidding is still closed");
		});
	});

	describe("checkUpkeep", () => {
		it("should return true when bidding is open", async () => {
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

		it("should change bidding status to CLOSED ", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await time.increase(180);

			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);
			expect(await NFT.biddingStatus()).to.equal(1);
		});

		it("should change bidding status to OPEN ", async () => {
			const { NFT } = await loadFixture(deployVotingContract);

			await time.increase(BIDDING_TIME);
			const [, performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(performData);

			await time.increase(CLOSED_BIDDING_TIME);
			const [, _performData] = await NFT.checkUpkeep("0x");
			await NFT.performUpkeep(_performData);

			expect(await NFT.biddingStatus()).to.equal(0);
		});
	});
});
