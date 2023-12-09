import { baseConfig } from "@/utils/contract";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useContractEvent, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useNotification from "../hooks/use-notification";
import { EventData, MintEvent } from "../types/contract-event";

export const MintNft = () => {
	const notification = useNotification();

	// Prepare contract
	const { config: mintConfig } = usePrepareContractWrite({
		...baseConfig,
		functionName: "mint",
		args: [1],
	});

	// Contract write
	const mint = useContractWrite(mintConfig);

	// Wait for transaction
	const mintTransaction = useWaitForTransaction({
		hash: mint.data?.hash,
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
		eventName: "Mint",
		listener: ([data]) => {
			const args = (data as unknown as EventData<MintEvent>).args;

			return notification?.({
				title: "Success",
				description: `Your NFT is minted (quantity: ${args.quantity})`,
				status: "success",
			});
		},
	});

	return (
		<Flex as="div" align="center" justify="center" direction="column" mt={4} gap={4} border="1px solid red">
			<Heading as="h4" size="md">
				You are in the winner list, you can mint your NFT
			</Heading>
			<Button
				isLoading={mint.isLoading || mintTransaction.isLoading}
				loadingText="Mint in progress"
				colorScheme="teal"
				size="lg"
				onClick={mint.write}
			>
				I mint my NFT
			</Button>
		</Flex>
	);
};
