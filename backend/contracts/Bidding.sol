// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

contract Bidding is AutomationCompatibleInterface {
    uint32 maxWinners;
    uint32 public biddingEndTime;
    uint32 public closedBiddingEndTime;
    uint32 delayBettweenBiddings;
    uint8 public biddingDuration;
    uint256 public minBidAmount;

    Bidder[] public winningBidders;
    BiddingStatus public biddingStatus;

    event EndBidding();
    event StartBidding();
    event SetBidding(uint256 bidAmount, string message);

    enum BiddingStatus {
        OPEN,
        CLOSED
    }

    struct Bidder {
        address bidderAddress;
        uint256 bidAmount;
    }

    constructor(
        uint8 _biddingDuration,
        uint8 _delayBettweenBiddings,
        uint32 _maxWinners,
        uint256 _minBidAmount
    ) {
        biddingDuration = _biddingDuration;
        minBidAmount = _minBidAmount;
        maxWinners = _maxWinners;
        delayBettweenBiddings = _delayBettweenBiddings;
        biddingStatus = BiddingStatus.CLOSED;
        // Start bidding
        startBidding();
    }

    function startBidding() internal {
        require(
            biddingStatus == BiddingStatus.CLOSED,
            "Bidding already in progress"
        );

        uint32 _biddingEndTime = uint32(
            block.timestamp + (biddingDuration * 60)
        );
        uint32 _closedBiddingEndTime = _biddingEndTime + delayBettweenBiddings;

        require(
            closedBiddingEndTime < block.timestamp,
            "Bidding is still closed"
        );

        closedBiddingEndTime = _closedBiddingEndTime;
        biddingEndTime = _biddingEndTime;
        biddingStatus = BiddingStatus.OPEN;

        emit StartBidding();
    }

    function endBidding() internal {
        require(
            biddingStatus == BiddingStatus.OPEN,
            "Bidding is alreay closed"
        );
        require(biddingEndTime < block.timestamp, "Bidding is still closed");
        biddingStatus = BiddingStatus.CLOSED;

        emit EndBidding();
    }

    function setBidding() external payable {
        bool isWinner = false;
        (isWinner, ) = isWinningBidder();

        require(isWinner, "Your bid is already winning");
        require(biddingStatus == BiddingStatus.OPEN, "Bidding is still closed");
        require(biddingEndTime > block.timestamp, "Bidding time is over"); // to remove if the automasisation is done.
        require(msg.value >= minBidAmount, "Bid amount is too low");

        bool _isWinningBidder = false;

        if (winningBidders.length < maxWinners) {
            _isWinningBidder = true;
            winningBidders.push(Bidder(msg.sender, msg.value));
        } else {
            Bidder memory lowestBidder;
            uint32 index;
            (lowestBidder, index) = getLowestBidder();

            if (lowestBidder.bidAmount < msg.value) {
                _isWinningBidder = true;
                (bool success, ) = payable(lowestBidder.bidderAddress).call{
                    value: lowestBidder.bidAmount
                }("");
                require(success, "Transfer failed.");
                winningBidders[index] = Bidder(msg.sender, msg.value);
            }
        }

        if (!_isWinningBidder) {
            emit SetBidding(msg.value, "You are not a winning bidder");
        }

        emit SetBidding(msg.value, "You are a winning bidder");
    }

    function isWinningBidder() internal view returns (bool, uint32 index) {
        bool isWinner = false;
        uint32 winnerIndex = 0;
        for (uint32 i = 0; i < winningBidders.length; i++) {
            if (winningBidders[i].bidderAddress == msg.sender) {
                isWinner = true;
                winnerIndex = i;
            }
        }
        return (isWinner, winnerIndex);
    }

    function getLowestBidder()
        internal
        view
        returns (Bidder memory, uint32 index)
    {
        Bidder memory lowestBidder = winningBidders[0];
        uint32 indexLowestBidder = 0;
        for (uint32 i = 1; i < winningBidders.length; i++) {
            if (winningBidders[i].bidAmount < lowestBidder.bidAmount) {
                lowestBidder = winningBidders[i];
                indexLowestBidder = i;
            }
        }
        return (lowestBidder, indexLowestBidder);
    }

    function checkUpkeep(
        bytes calldata checkData
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (biddingStatus == BiddingStatus.OPEN) {
            return (true, abi.encodePacked(uint256(0)));
        } else if (biddingStatus == BiddingStatus.CLOSED) {
            return (true, abi.encodePacked(uint256(1)));
        } else {
            return (false, checkData);
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        uint256 decodedValue = abi.decode(performData, (uint256));
        if (decodedValue == 0) {
            endBidding();
        } else if (decodedValue == 1) {
            startBidding();
        }
    }
}
