"use client";

import { baseConfig } from "@/utils/contract";
import { useContractEvent, useContractRead } from "wagmi";
import { ClosedBidding } from "../components/closed-bidding";
import isAuth from "../components/is-auth";
import { OpenBidding } from "../components/open-bidding";
import useHasMounted from "../hooks/use-has-mounted";
import useNotification from "../hooks/use-notification";
import { BiddingStatus } from "../types/bidding";
import { EventData } from "../types/contract-event";

const Bidding = () => {
	const hasMounted = useHasMounted();
	const notification = useNotification();
	const { data: biddingStatus } = useContractRead({
		...baseConfig,
		functionName: "biddingStatus",
		watch: true,
	});

	console.log("biddingStatus", biddingStatus);

	useContractEvent({
		...baseConfig,
		eventName: "StartBidding",
		listener: ([data]) => {
			const args = (data as unknown as EventData).args;

			console.log(data, args);
			return notification?.({
				title: "Success",
				description: "Bidding is open",
				status: "success",
			});
		},
	});

	useContractEvent({
		...baseConfig,
		eventName: "EndBidding",
		listener: ([data]) => {
			const args = (data as unknown as EventData).args;

			console.log(data, args);
			return notification?.({
				title: "Success",
				description: "Bidding is closed",
				status: "success",
			});
		},
	});

	// Debug for refund
	useContractEvent({
		...baseConfig,
		eventName: "Refund",
		listener: ([data]) => {
			const args = (data as unknown as EventData).args;

			console.log("Refund", data, args);
			return notification?.({
				title: "Success",
				description: "Refund event",
				status: "success",
			});
		},
	});

	return hasMounted && (biddingStatus === BiddingStatus.OPEN ? <OpenBidding /> : <ClosedBidding />);
};

export default isAuth(Bidding);
