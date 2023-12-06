import { Flex, Heading, Text } from "@chakra-ui/react";

type HeaderBiddingProps = {
	items: { heading: string; text: string }[];
};

export const HeaderBidding = ({ items }: HeaderBiddingProps) => {
	return (
		<Flex as="div" align="center" justify="space-around">
			{items.map((item) => {
				return (
					<Flex as="div" align="center" justify="center" direction="column">
						<Heading as="h4" size="md">
							{item.heading}
						</Heading>
						<Text>{item.text}</Text>
					</Flex>
				);
			})}
		</Flex>
	);
};
