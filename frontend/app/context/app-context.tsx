"use client";

import { baseConfig } from "@/utils/contract";
import { useToast } from "@chakra-ui/react";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { GetAccountResult } from "wagmi/actions";
import { Bidder } from "../types/bidder";

export type AppContextType = {
	connectedWallet: GetAccountResult;
	notification: ReturnType<typeof useToast>;
	winners: Bidder[];
	setWinners: Dispatch<SetStateAction<Bidder[]>>;
	balanceOfNFTs: number;
} | null;

const AppContext = createContext<AppContextType>(null);

export function AppContextWrapper({ children }: { children: ReactNode }) {
	const [winners, setWinners] = useState<Bidder[]>([]);
	const wallet = useAccount();
	const notification = useToast();

	const { data: balanceOfNFTs } = useContractRead({
		...baseConfig,
		functionName: "balanceOf",
		args: [wallet?.address],
	});

	const value = {
		connectedWallet: wallet,
		notification,
		winners,
		setWinners,
		balanceOfNFTs: Number(balanceOfNFTs),
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	return useContext(AppContext);
}
