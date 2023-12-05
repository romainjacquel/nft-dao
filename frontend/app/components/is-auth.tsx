"use client";
import { redirect } from "next/navigation";
import React, { useLayoutEffect } from "react";
import useConnectedWallet from "../hooks/use-connected-wallet";

// biome-ignore lint/suspicious/noExplicitAny: Need to type this later
export default function isAuth(Component: any) {
	// biome-ignore lint/suspicious/noExplicitAny: Need to type this later
	return function IsAuth(props: any) {
		const wallet = useConnectedWallet();

		useLayoutEffect(() => {
			if (!wallet?.isConnected) {
				return redirect("/");
			}
		}, [wallet?.isConnected]);

		return <Component {...props} />;
	};
}
