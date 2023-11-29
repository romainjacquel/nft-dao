// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BiddingAuction is Ownable {
    uint256 public constant NUM_WINNERS = 100;
    uint256 public constant AUCTION_DURATION = 1 hours;
    uint256 public constant DELAY_BETWEEN_AUCTIONS = 10 minutes;

    uint256 public auctionEndTime;
    uint256 public bidCount;
    uint256[NUM_WINNERS] public highestBids;
    address[NUM_WINNERS] public highestBidders;

    bytes32 internal keyHash;
    uint256 internal fee;

    event AuctionEnded(uint256[] winningBids, address[] winningBidders);

    modifier auctionOpen() {
        require(block.timestamp < auctionEndTime, "Auction is closed");
        _;
    }

    modifier onlyAfterAuctionEnd() {
        require(block.timestamp >= auctionEndTime, "Auction is still open");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Initialize auction end time
        startNewAuction();
    }

    function placeBid() external payable auctionOpen {
        require(
            msg.value > highestBids[NUM_WINNERS - 1],
            "Bid amount is too low"
        );

        // Add the bid to the list and sort
        highestBids[NUM_WINNERS - 1] = msg.value;
        highestBidders[NUM_WINNERS - 1] = msg.sender;

        for (uint256 i = NUM_WINNERS - 2; i >= 0; i--) {
            if (highestBids[i] < highestBids[i + 1]) {
                (highestBids[i], highestBids[i + 1]) = (
                    highestBids[i + 1],
                    highestBids[i]
                );
                (highestBidders[i], highestBidders[i + 1]) = (
                    highestBidders[i + 1],
                    highestBidders[i]
                );
            } else {
                break;
            }
        }

        // Increment bid count
        bidCount++;
    }

    function endAuction() external onlyOwner onlyAfterAuctionEnd {
        // Emit event with winning bids and bidders
        uint256[] memory winningBids = new uint256[](NUM_WINNERS);
        for (uint256 i = 0; i < NUM_WINNERS; i++) {
            winningBids[i] = highestBids[i];
        }
        address[] memory winningBidders = new address[](NUM_WINNERS);
        for (uint256 i = 0; i < NUM_WINNERS; i++) {
            winningBidders[i] = highestBidders[i];
        }
        emit AuctionEnded(winningBids, winningBidders);

        // Start a new auction after the delay
        startNewAuction();
    }

    function startNewAuction() internal {
        auctionEndTime =
            block.timestamp +
            AUCTION_DURATION +
            DELAY_BETWEEN_AUCTIONS;

        // Initialize the highest bids array
        for (uint256 i = 0; i < NUM_WINNERS; i++) {
            highestBids[i] = 0;
            highestBidders[i] = address(0);
        }

        // Reset bid count
        bidCount = 0;
    }

    // function getCurrentTime() public returns (bytes32 requestId) {
    //     return requestRandomness(keyHash, fee);
    // }

    // function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    //     // Not used in this example, but you can use randomness for more advanced time calculations if needed
    //     // For simplicity, the auction end time is updated in the startNewAuction function
    //     // You may adjust this function based on your specific requirements
    // }
}
