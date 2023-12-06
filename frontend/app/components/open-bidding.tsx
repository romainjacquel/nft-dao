import { baseConfig } from "@/utils/contract";
import { getFormattedDate } from "@/utils/date";
import { formatEther } from "viem";
import { useContractRead } from "wagmi";
import { HeaderBidding } from "./header-bidding";

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

	const HEADER_ITEMS = [
		{ heading: "Bidding duration", text: `${Number(biddingDuration)} mn` },
		{
			heading: "Bidding end time",
			text: getFormattedDate(Number(biddingEndTime)),
		},
		{ heading: "Min bid amount", text: `${formatEther(BigInt(Number(minBidAmount)))} ETH` },
	];

	return (
		<>
			<HeaderBidding items={HEADER_ITEMS} />
		</>
	);
};
