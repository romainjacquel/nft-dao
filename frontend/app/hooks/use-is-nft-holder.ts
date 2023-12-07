import { useAppContext } from "../context/app-context";

const useIsNFTHolder = () => {
	const context = useAppContext();

	if (context?.balanceOfNFTs) {
		return { balance: context.balanceOfNFTs, isHolder: context.balanceOfNFTs > 0 };
	}
	return { balance: 0, isHolder: false };
};

export default useIsNFTHolder;
