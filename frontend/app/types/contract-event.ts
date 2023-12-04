// biome-ignore lint/suspicious/noExplicitAny: Args can be any type
export type EventData<T = any> = {
	args: T;
};
