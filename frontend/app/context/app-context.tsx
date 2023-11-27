"use client";

import { useToast } from "@chakra-ui/react";
import { ReactNode, createContext, useContext } from "react";
import { useAccount } from "wagmi";
import { GetAccountResult } from "wagmi/actions";

export type AppContextType = {
	connectedWallet: GetAccountResult;
	notification: ReturnType<typeof useToast>;
} | null;

const AppContext = createContext<AppContextType>(null);

export function AppContextWrapper({ children }: { children: ReactNode }) {
	const wallet = useAccount();
	const notification = useToast();

	const value = {
		connectedWallet: wallet,
		notification,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	return useContext(AppContext);
}
