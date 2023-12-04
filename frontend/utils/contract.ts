export const CONTRACT_ABI = [
	{
		inputs: [
			{
				internalType: "uint8",
				name: "_biddingDuration",
				type: "uint8",
			},
			{
				internalType: "uint8",
				name: "_delayBettweenBiddings",
				type: "uint8",
			},
			{
				internalType: "uint32",
				name: "_maxWinners",
				type: "uint32",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "OwnableInvalidOwner",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "OwnableUnauthorizedAccount",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [],
		name: "EndBidding",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "bidAmount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "string",
				name: "message",
				type: "string",
			},
		],
		name: "SetBidding",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [],
		name: "StartBidding",
		type: "event",
	},
	{
		inputs: [],
		name: "biddingDuration",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "biddingEndTime",
		outputs: [
			{
				internalType: "uint32",
				name: "",
				type: "uint32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "biddingStatus",
		outputs: [
			{
				internalType: "enum Bidding.BiddingStatus",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "checkData",
				type: "bytes",
			},
		],
		name: "checkUpkeep",
		outputs: [
			{
				internalType: "bool",
				name: "upkeepNeeded",
				type: "bool",
			},
			{
				internalType: "bytes",
				name: "performData",
				type: "bytes",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "closedBiddingEndTime",
		outputs: [
			{
				internalType: "uint32",
				name: "",
				type: "uint32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "delayBettweenBiddings",
		outputs: [
			{
				internalType: "uint32",
				name: "",
				type: "uint32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "endBidding",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "maxWinners",
		outputs: [
			{
				internalType: "uint32",
				name: "",
				type: "uint32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "minBidAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "performData",
				type: "bytes",
			},
		],
		name: "performUpkeep",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "setBidding",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "startBidding",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "winningBidders",
		outputs: [
			{
				internalType: "address",
				name: "bidderAddress",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "bidAmount",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];

export const CONTRACT_ADDRESS = "0xDeF8Db16d0ed1612650e88EFb0E2e5d8B2692Cf6";

type BaseConfigType = {
	address: `0x${string}`;
	abi: typeof CONTRACT_ABI;
};

export const baseConfig: BaseConfigType = {
	address: CONTRACT_ADDRESS as BaseConfigType["address"],
	abi: CONTRACT_ABI,
};
