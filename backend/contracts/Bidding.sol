// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

/**
 * @title Bidding
 * @dev Smart contract for managing an automated auction with NFTs.
 * The contract complies with the AutomationCompatibleInterface from Chainlink.
 */
contract Bidding is AutomationCompatibleInterface {
    uint32 maxWinners;
    uint32 public biddingEndTime;
    uint32 public closedBiddingEndTime;
    uint32 delayBetweenBiddings;
    uint8 public biddingDuration;
    uint256 public minBidAmount;

    Bidder[] public winningBidders;
    BiddingStatus public biddingStatus;

    event EndBidding();
    event StartBidding();
    event SetBidding(uint256 bidAmount, string message);

    /**
     * @dev Enumeration representing the state of the auction.
     * - OPEN: Auction in progress.
     * - CLOSED: Auction closed.
     */
    enum BiddingStatus {
        OPEN,
        CLOSED
    }

    /**
     * @dev Structure representing a bidder.
     * - bidderAddress: Address of the bidder.
     * - bidAmount: Amount of the bid.
     */
    struct Bidder {
        address bidderAddress;
        uint256 bidAmount;
    }

    /**
     * @dev Constructor for the contract.
     * @param _biddingDuration Duration of the auction in minutes.
     * @param _delayBetweenBiddings Delay between auctions in seconds.
     * @param _maxWinners Maximum number of winning bidders.
     * @param _minBidAmount Minimum bid amount.
     */
    constructor(
        uint8 _biddingDuration,
        uint8 _delayBetweenBiddings,
        uint32 _maxWinners,
        uint256 _minBidAmount
    ) {
        biddingDuration = _biddingDuration;
        minBidAmount = _minBidAmount;
        maxWinners = _maxWinners;
        delayBetweenBiddings = _delayBetweenBiddings;
        biddingStatus = BiddingStatus.CLOSED;
        // Start bidding
        startBidding();
    }

    /**
     * @dev Starts a new auction.
     */
    function startBidding() internal {
        require(
            biddingStatus == BiddingStatus.CLOSED,
            "Bidding already in progress"
        );

        uint32 _biddingEndTime = uint32(
            block.timestamp + (biddingDuration * 60)
        );
        uint32 _closedBiddingEndTime = _biddingEndTime + delayBetweenBiddings;

        require(
            closedBiddingEndTime < block.timestamp,
            "Bidding is still closed"
        );

        closedBiddingEndTime = _closedBiddingEndTime;
        biddingEndTime = _biddingEndTime;
        biddingStatus = BiddingStatus.OPEN;

        emit StartBidding();
    }

    /**
     * @dev Ends the ongoing auction.
     */
    function endBidding() internal {
        require(
            biddingStatus == BiddingStatus.OPEN,
            "Bidding is already closed"
        );
        require(biddingEndTime < block.timestamp, "Bidding is still closed");
        biddingStatus = BiddingStatus.CLOSED;

        emit EndBidding();
    }

    /**
     * @dev Places a bid with a specified amount.
     */
    function setBidding() external payable {
        bool isWinner = false;
        (isWinner, ) = isWinningBidder();

        require(isWinner, "Your bid is already winning");
        require(biddingStatus == BiddingStatus.OPEN, "Bidding is still closed");
        require(biddingEndTime > block.timestamp, "Bidding time is over");
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

    /**
     * @dev Checks if the caller is a winning bidder.
     * @return isWinner Indicates if the caller is a winner.
     * @return index Index of the bidder in the list of winners.
     */
    function isWinningBidder()
        internal
        view
        returns (bool isWinner, uint32 index)
    {
        isWinner = false;
        uint32 winnerIndex = 0;
        for (uint32 i = 0; i < winningBidders.length; i++) {
            if (winningBidders[i].bidderAddress == msg.sender) {
                isWinner = true;
                winnerIndex = i;
            }
        }
        return (isWinner, winnerIndex);
    }

    /**
     * @dev Gets the bidder with the lowest bid among the winners.
     * @return lowestBidder The bidder with the lowest bid.
     * @return index Index of the lowest bidder in the list.
     */
    function getLowestBidder()
        internal
        view
        returns (Bidder memory lowestBidder, uint32 index)
    {
        lowestBidder = winningBidders[0];
        uint32 indexLowestBidder = 0;
        for (uint32 i = 1; i < winningBidders.length; i++) {
            if (winningBidders[i].bidAmount < lowestBidder.bidAmount) {
                lowestBidder = winningBidders[i];
                indexLowestBidder = i;
            }
        }
        return (lowestBidder, indexLowestBidder);
    }

    /**
     * @dev Checks if upkeep is needed based on the current bidding status.
     * @param checkData Additional data for upkeep check.
     * @return upkeepNeeded Indicates if upkeep is needed.
     * @return performData Data to be used in the performUpkeep function.
     */
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

    /**
     * @dev Performs upkeep based on the decoded performData.
     * @param performData Data obtained from checkUpkeep.
     */
    function performUpkeep(bytes calldata performData) external override {
        uint256 decodedValue = abi.decode(performData, (uint256));
        if (decodedValue == 0) {
            endBidding();
        } else if (decodedValue == 1) {
            startBidding();
        }
    }
}
