// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bidding is Ownable {
    uint32 public max_winners;
    uint32 public bidding_end_time;
    uint32 public closed_bidding_end_time;
    uint8 public bidding_duration;
    uint256 public min_bid_amount;
    uint32 public delay_bettween_biddings;

    Bidder[] public winning_bidders;
    BiddingStatus public bidding_status;

    enum BiddingStatus {
        OPEN,
        CLOSED
    }

    struct Bidder {
        address bidder_address;
        uint256 bid_amount;
    }

    constructor(
        uint8 _bidding_duration,
        uint8 _delay_bettween_biddings,
        uint32 _max_winners
    ) Ownable(msg.sender) {
        bidding_duration = _bidding_duration;
        min_bid_amount = 1 ether;
        max_winners = _max_winners;
        delay_bettween_biddings = _delay_bettween_biddings;
        bidding_status = BiddingStatus.CLOSED;
        // Start bidding
        startBidding();
    }

    function startBidding() public onlyOwner {
        require(
            bidding_status == BiddingStatus.CLOSED,
            "Bidding already in progress"
        );

        uint32 _biding_end_time = uint32(
            block.timestamp + (bidding_duration * 60)
        );
        uint32 _closed_bidding_end_time = _biding_end_time +
            delay_bettween_biddings;

        require(
            closed_bidding_end_time < block.timestamp,
            "Bidding is still closed"
        );

        closed_bidding_end_time = _closed_bidding_end_time;
        bidding_end_time = _biding_end_time;
        bidding_status = BiddingStatus.OPEN;
    }

    function endBidding() external onlyOwner {
        require(
            bidding_status == BiddingStatus.OPEN,
            "Bidding is alreay closed"
        );
        require(bidding_end_time < block.timestamp, "Bidding is still closed");
        bidding_status = BiddingStatus.CLOSED;
    }

    function setBidding() external payable {
        require(!alreadyBid(), "You already bid");
        require(
            bidding_status == BiddingStatus.OPEN,
            "Bidding is still closed"
        );
        require(bidding_end_time > block.timestamp, "Bidding time is over"); // to remove if the automasisation is done.
        require(msg.value >= min_bid_amount, "Bid amount is too low");

        if (winning_bidders.length < max_winners) {
            winning_bidders.push(Bidder(msg.sender, msg.value));
        } else {
            for (uint32 i = 0; i < max_winners; i++) {
                if (winning_bidders[i].bid_amount < msg.value) {
                    (bool success, ) = payable(
                        winning_bidders[i].bidder_address
                    ).call{value: winning_bidders[i].bid_amount}("");
                    require(success, "Transfer failed.");
                    winning_bidders[i] = Bidder(msg.sender, msg.value);
                    break;
                }
            }
        }
    }

    function alreadyBid() internal view returns (bool) {
        for (uint32 i = 0; i < winning_bidders.length; i++) {
            if (winning_bidders[i].bidder_address == msg.sender) {
                return true;
            }
        }
        return false;
    }
}
