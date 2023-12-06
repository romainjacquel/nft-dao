"use client";

import { useToast } from "@chakra-ui/react";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { useAccount } from "wagmi";
import { GetAccountResult } from "wagmi/actions";
import { Bidder } from "../types/bidder";

export type AppContextType = {
	connectedWallet: GetAccountResult;
	notification: ReturnType<typeof useToast>;
	winners: Bidder[];
	setWinners: Dispatch<SetStateAction<Bidder[]>>;
} | null;

const AppContext = createContext<AppContextType>(null);

export function AppContextWrapper({ children }: { children: ReactNode }) {
	const [winners, setWinners] = useState<Bidder[]>([]);
	const wallet = useAccount();
	const notification = useToast();

	const value = {
		connectedWallet: wallet,
		notification,
		winners,
		setWinners,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	return useContext(AppContext);
}
