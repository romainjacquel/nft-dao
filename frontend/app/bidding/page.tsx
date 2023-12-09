"use client";

import { baseConfig } from "@/utils/contract";
import { useContractEvent, useContractRead } from "wagmi";
import { ClosedBidding } from "../components/closed-bidding";
import isAuth from "../components/is-auth";
import { OpenBidding } from "../components/open-bidding";
import useHasMounted from "../hooks/use-has-mounted";
import useNotification from "../hooks/use-notification";
import useWinners from "../hooks/use-winners";
import { BiddingStatus } from "../types/bidding";

const Bidding = () => {
	const { setWinners } = useWinners();
	const hasMounted = useHasMounted();
	const notification = useNotification();
	const { data: biddingStatus } = useContractRead({
		...baseConfig,
		functionName: "biddingStatus",
		watch: true,
	});

	useContractEvent({
		...baseConfig,
		eventName: "StartBidding",
		listener: () => {
			setWinners?.([]);
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
		listener: () =>
			notification?.({
				title: "Success",
				description: "Bidding is closed",
				status: "success",
			}),
	});

	return hasMounted && (biddingStatus === BiddingStatus.OPEN ? <OpenBidding /> : <ClosedBidding />);
};

export default isAuth(Bidding);
