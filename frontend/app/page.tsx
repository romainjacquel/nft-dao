"use client";

import { baseConfig } from "@/utils/contract";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContractEvent, useContractRead } from "wagmi";
import { EventData } from "./types/contract-event";

export default function Home() {
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

	return (
		<div>
			<h1>My app</h1>
			<ConnectButton />
		</div>
	);
}
