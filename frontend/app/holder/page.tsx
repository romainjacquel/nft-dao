"use client";

import { baseConfig } from "@/utils/contract";
import { Text } from "@chakra-ui/react";
import { useContractRead } from "wagmi";
import isAuth from "../components/is-auth";
import useConnectedWallet from "../hooks/use-connected-wallet";

const Holder = () => {
	const wallet = useConnectedWallet();

	const { data: balanceOf } = useContractRead({
		...baseConfig,
		functionName: "balanceOf",
		args: [wallet?.address ?? ""],
	});

	console.log("balanceOf", balanceOf);

	return (
		<>
			<h1>Holder</h1>
			<Text>You own ${Number(balanceOf)} Nft</Text>
		</>
	);
};

export default isAuth(Holder);
