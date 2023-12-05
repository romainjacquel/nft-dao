// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Bidding.sol";

contract NFT is ERC721A, Bidding, Ownable {
    using Strings for uint;

    uint256 private constant PRICE_PER_NFT = 0.02 ether;
    uint8 private constant MAX_NFT_PER_WALLET = 2;
    string public baseURI =
        "ipfs://bafybeicwjq4fehsvubiqq6ro6ceig4vlb7vusyvzsqse6gp2ugrdnctv4a/";

    mapping(address => uint8) NFTsPerWallet;

    constructor()
        ERC721A("NFT-DAO", "NFD")
        Ownable(msg.sender)
        Bidding(1, 10, 1, PRICE_PER_NFT)
    {}

    function mint(uint8 _quantity) external payable {
        require(biddingStatus == BiddingStatus.CLOSED, "Bidding still open");
        bool isWinner = false;
        uint32 winnerIndex = 0;
        (isWinner, winnerIndex) = isWinningBidder();
        require(isWinner, "You are not a winner");
        require(
            NFTsPerWallet[msg.sender] + _quantity <= MAX_NFT_PER_WALLET,
            "Too many nfts in your wallet"
        );
        require(totalSupply() + _quantity <= maxWinners, "Max supply exceded");
        require(msg.value >= PRICE_PER_NFT * _quantity, "Amount to low");

        NFTsPerWallet[msg.sender] += _quantity;

        if (NFTsPerWallet[msg.sender] >= MAX_NFT_PER_WALLET) {
            delete winningBidders[winnerIndex];
        }

        _safeMint(msg.sender, _quantity);
    }

    // For reveal
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function tokenURI(
        uint _tokenId
    ) public view virtual override(ERC721A) returns (string memory) {
        require(_exists(_tokenId), "Token not found");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");

        require(success, "Withdraw failed");
    }
}
