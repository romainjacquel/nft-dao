import { useAppContext } from "../context/app-context";

const useWinners = () => {
	const context = useAppContext();

	if (context?.setWinners) {
		return { winners: context.winners ?? [], setWinners: context.setWinners };
	}
	return {};
};

export default useWinners;
