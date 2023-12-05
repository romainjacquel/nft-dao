"use client";

import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";
import NotConnected from "./components/not-connected";
import useConnectedWallet from "./hooks/use-connected-wallet";

export default function Home() {
	const wallet = useConnectedWallet();

	useLayoutEffect(() => {
		if (wallet?.isConnected) {
			redirect("/bidding");
		}
	}, [wallet?.isConnected]);

	return <NotConnected />;
}
