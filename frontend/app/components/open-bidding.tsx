"use client";

import { baseConfig } from "@/utils/contract";
import {
	Button,
	Flex,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	SimpleGrid,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { formatEther, parseEther } from "viem";
import {
	useContractEvent,
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
} from "wagmi";
import useNotification from "../hooks/use-notification";
import useWinners from "../hooks/use-winners";
import { EventData, SetBiddingLoseEvent, SetBiddingWinEvent } from "../types/contract-event";
import { HeaderBidding } from "./header-bidding";

export const OpenBidding = () => {
	const [amount, setAmount] = useState<bigint | undefined>(undefined);
	const { winners, setWinners } = useWinners();
	const notification = useNotification();

	// Contract read
	const { data: biddingEndTime } = useContractRead({
		...baseConfig,
		functionName: "biddingEndTime",
	});

	const { data: biddingDuration } = useContractRead({
		...baseConfig,
		functionName: "biddingDuration",
	});

	const { data: minBidAmount } = useContractRead({
		...baseConfig,
		functionName: "minBidAmount",
	});

	// Prepare contract
	const { config: setBiddingConfig } = usePrepareContractWrite({
		...baseConfig,
		functionName: "setBidding",
		value: amount,
	});

	// Contract write
	const setBidding = useContractWrite(setBiddingConfig);

	// Wait for transaction
	const setBiddingTransaction = useWaitForTransaction({
		hash: setBidding.data?.hash,
		onError: () =>
			notification?.({
				title: "Error",
				description: "Impossible to send transaction",
				status: "error",
			}),
	});

	// Contract events
	useContractEvent({
		...baseConfig,
		eventName: "SetBiddingWin",
		listener: ([data]) => {
			const args = (data as unknown as EventData<SetBiddingWinEvent>).args;

			setWinners?.(args.winningBidders);

			return notification?.({
				title: "Success",
				description: args.message,
				status: "success",
			});
		},
	});

	useContractEvent({
		...baseConfig,
		eventName: "SetBiddingLose",
		listener: ([data]) => {
			const args = (data as unknown as EventData<SetBiddingLoseEvent>).args;

			return notification?.({
				title: "Warning",
				description: args.message,
				status: "warning",
			});
		},
	});

	const HEADER_ITEMS = [
		{ heading: "Bidding duration", text: `${Number(biddingDuration)} mn` },
		{
			heading: "Bidding end time",
			text: String(new Date(Number(biddingEndTime) * 1000)),
		},
		{ heading: "Min bid amount", text: `${minBidAmount ? formatEther(minBidAmount as unknown as bigint) : "0"} ETH` },
	];

	useEffect(() => {
		if (setWinners) setWinners([]);
	}, [setWinners]);

	return (
		<>
			<HeaderBidding items={HEADER_ITEMS} />
			<SimpleGrid columns={2} spacing={10} mt={6}>
				<Flex as="div" align="center" justify="start" direction="column" gap={4}>
					<Heading as="h4" size="md">
						Bid
					</Heading>
					<Flex as="div" direction="row" width="100%" gap={2}>
						<InputGroup flex={7}>
							<InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
								<FaEthereum />
							</InputLeftElement>
							<Input
								onChange={(e) => {
									if (e.target.value) {
										setAmount(parseEther(e.target.value));
									}
								}}
								placeholder="Enter amount in ETH"
								type="number"
							/>
						</InputGroup>
						<Button
							isLoading={setBidding.isLoading || setBiddingTransaction.isLoading}
							loadingText="Transaction pending"
							flex={3}
							colorScheme="teal"
							onClick={setBidding.write}
						>
							Send
						</Button>
					</Flex>
				</Flex>
				<Flex as="div" align="center" justify="center" direction="column" gap={4}>
					<Heading as="h4" size="md">
						Winning bidders
					</Heading>
					<TableContainer w="100%">
						<Table variant="simple">
							<TableCaption>Current winning bidders</TableCaption>
							<Thead>
								<Tr>
									<Th>Address</Th>
									<Th>Amount in ETH</Th>
								</Tr>
							</Thead>
							<Tbody>
								{winners && winners.length > 0
									? winners?.map((bidder) => {
											return (
												<Tr key={bidder.bidderAddress}>
													<Td>{bidder.bidderAddress}</Td>
													<Td isNumeric>{bidder.bidAmount ? formatEther(bidder.bidAmount as unknown as bigint) : "0"}</Td>
												</Tr>
											);
									  })
									: null}
							</Tbody>
						</Table>
					</TableContainer>
				</Flex>
			</SimpleGrid>
		</>
	);
};
