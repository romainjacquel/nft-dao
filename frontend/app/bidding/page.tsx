"use client";

import { baseConfig } from "@/utils/contract";
import { useContractEvent, useContractRead } from "wagmi";
import isAuth from "../components/is-auth";
import { OpenBidding } from "../components/open-bidding";
import { BiddingStatus } from "../types/bidding";
import { EventData } from "../types/contract-event";

const Bidding = () => {
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
		},
	});

	useContractEvent({
		...baseConfig,
		eventName: "EndBidding",
		listener: ([data]) => {
			const args = (data as unknown as EventData).args;

			console.log(data, args);
		},
	});

	return biddingStatus === BiddingStatus.OPEN ? (
		<OpenBidding />
	) : (
		<div>
			<h1>Closed bidding</h1>
		</div>
	);
};

export default isAuth(Bidding);
