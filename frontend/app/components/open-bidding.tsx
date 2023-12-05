import { baseConfig } from "@/utils/contract";
import { getFormattedDate } from "@/utils/date";
import { Flex, Text } from "@chakra-ui/react";
import { useContractRead } from "wagmi";

export const OpenBidding = () => {
	const { data: biddingEndTime } = useContractRead({
		...baseConfig,
		functionName: "biddingEndTime",
	});

	const { data: biddingDuration } = useContractRead({
		...baseConfig,
		functionName: "biddingDuration",
		watch: true,
	});

	const { data: minBidAmount } = useContractRead({
		...baseConfig,
		functionName: "minBidAmount",
		watch: true,
	});

	return (
		<>
			<Flex as="div" align="center" justify="space-around">
				<Text>Bidding end time: {getFormattedDate(Number(biddingEndTime))}</Text>
				<Text>Bidding duration: {Number(biddingDuration)} mn</Text>
				<Text>Min bid amount: {Number(minBidAmount)} wei</Text>
			</Flex>
		</>
	);
};
