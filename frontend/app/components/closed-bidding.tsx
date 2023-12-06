import { baseConfig } from "@/utils/contract";
import { useContractRead } from "wagmi";
import useConnectedWallet from "../hooks/use-connected-wallet";
import useWinners from "../hooks/use-winners";
import { HeaderBidding } from "./header-bidding";
import { MintNft } from "./mint-nft";
import { WaitingPage } from "./waiting-page";

export const ClosedBidding = () => {
	const wallet = useConnectedWallet();
	const { winners } = useWinners();
	// Contract read
	const { data: closedBiddingEndTime } = useContractRead({
		...baseConfig,
		functionName: "closedBiddingEndTime",
	});

	const { data: closedBiddingDuration } = useContractRead({
		...baseConfig,
		functionName: "delayBetweenBiddings",
		watch: true,
	});

	const HEADER_ITEMS = [
		{ heading: "Closed bidding end time", text: String(new Date(Number(closedBiddingEndTime) * 1000)) },
		{ heading: "Closed bidding duration", text: `${Number(closedBiddingDuration)} s` },
	];

	return (
		<>
			<HeaderBidding items={HEADER_ITEMS} />
			{winners?.some((element) => element.bidderAddress === wallet?.address) ? <MintNft /> : <WaitingPage />}
		</>
	);
};
