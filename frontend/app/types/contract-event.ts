import { Bidder } from "./bidder";

export type MintEvent = {
	quantity: number;
};

export type SetBiddingLoseEvent = {
	bidAmount: number;
	message: string;
};

export type SetBiddingWinEvent = {
	bidAmount: number;
	message: string;
	winningBidders: Bidder[];
};

// biome-ignore lint/suspicious/noExplicitAny: Args can be any type
export type EventData<T = any> = {
	args: T;
};
