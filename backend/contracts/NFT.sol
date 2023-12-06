// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Bidding.sol";

/**
 * @title NFT
 * @dev Smart contract for managing ERC-721A NFTs with additional features such as a bidding system.
 * This contract extends ERC721A, Bidding, and Ownable contracts.
 */
contract NFT is ERC721A, Bidding, Ownable {
    using Strings for uint;

    uint256 private constant PRICE_PER_NFT = 0.02 ether;
    uint8 private constant MAX_NFT_PER_WALLET = 2;
    string public baseURI =
        "ipfs://bafybeicwjq4fehsvubiqq6ro6ceig4vlb7vusyvzsqse6gp2ugrdnctv4a/";

    mapping(address => uint8) NFTsPerWallet;

    event Mint(uint8 quantity);

    /**
     * @dev Constructor for the NFT contract.
     * Initializes ERC721A, Ownable, and Bidding contracts with specific parameters.
     */
    constructor()
        ERC721A("NFT-DAO", "NFD")
        Ownable(msg.sender)
        Bidding(3, 120, 1, PRICE_PER_NFT)
    {}

    /**
     * @dev Mints NFTs for the caller based on the current bidding status.
     * @param _quantity The quantity of NFTs to mint.
     */
    function mint(uint8 _quantity) external payable {
        require(biddingStatus == BiddingStatus.CLOSED, "Bidding still open");
        bool isWinner = false;
        uint32 winnerIndex = 0;
        (isWinner, winnerIndex) = isWinningBidder();
        require(isWinner, "You are not a winner");
        require(
            NFTsPerWallet[msg.sender] + _quantity <= MAX_NFT_PER_WALLET,
            "Too many NFTs in your wallet"
        );
        require(totalSupply() + _quantity <= maxWinners, "Max supply exceeded");
        require(msg.value >= PRICE_PER_NFT * _quantity, "Amount too low");

        NFTsPerWallet[msg.sender] += _quantity;

        if (NFTsPerWallet[msg.sender] >= MAX_NFT_PER_WALLET) {
            delete winningBidders[winnerIndex];
        }

        _safeMint(msg.sender, _quantity);

        emit Mint(_quantity);
    }

    /**
     * @dev Sets the base URI for the NFTs.
     * @param _baseURI The new base URI.
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    /**
     * @dev Returns the token URI for a given token ID.
     * @param _tokenId The ID of the token.
     * @return The full token URI.
     */
    function tokenURI(
        uint _tokenId
    ) public view virtual override(ERC721A) returns (string memory) {
        require(_exists(_tokenId), "Token not found");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    /**
     * @dev Allows the contract owner to withdraw the contract's balance.
     */
    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");

        require(success, "Withdraw failed");
    }
}
