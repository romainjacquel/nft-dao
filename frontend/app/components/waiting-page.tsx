import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { FaSadCry } from "react-icons/fa";

export const WaitingPage = () => {
	return (
		<Box textAlign="center" p="4">
			<Flex direction="column" justifyContent="center" alignItems="center" height="70vh">
				<Box mb="4">
					<Icon as={FaSadCry} boxSize="50px" color="teal.500" />
					<Heading as="h1" fontSize="4xl" mt="4">
						You are not in the winner list
					</Heading>
					<Text fontSize="lg" mt="2">
						Please wait for the next bidding
					</Text>
				</Box>
			</Flex>
		</Box>
	);
};
