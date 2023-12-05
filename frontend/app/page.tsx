"use client";

import { baseConfig } from "@/utils/contract";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";
import { useContractRead } from "wagmi";
import NotConnected from "./components/not-connected";
import useConnectedWallet from "./hooks/use-connected-wallet";

export default function Home() {
	const wallet = useConnectedWallet();
	const { data: biddingStatus } = useContractRead({
		...baseConfig,
		functionName: "biddingStatus",
		watch: true,
	});

	console.log("biddingStatus", biddingStatus);

	useLayoutEffect(() => {
		if (wallet?.isConnected) {
			redirect("/bidding");
		}
	}, [wallet?.isConnected]);

	// useContractEvent({
	// 	...baseConfig,
	// 	eventName: "StartBidding",
	// 	listener: ([data]) => {
	// 		const args = (data as unknown as EventData).args;

	// 		console.log(data, args);
	// 	},
	// });

	// useContractEvent({
	// 	...baseConfig,
	// 	eventName: "EndBidding",
	// 	listener: ([data]) => {
	// 		const args = (data as unknown as EventData).args;

	// 		console.log(data, args);
	// 	},
	// });

	return <NotConnected />;
}
