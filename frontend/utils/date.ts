export const getFormattedDate = (timestamp: number) => {
	const date = new Date(timestamp * 1000);
	return new Intl.DateTimeFormat("default", {
		dateStyle: "full",
		timeStyle: "medium",
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	}).format(date);
};
