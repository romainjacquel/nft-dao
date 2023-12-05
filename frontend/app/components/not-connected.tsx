import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaVoteYea } from "react-icons/fa";

const NotConnected = () => {
	return (
		<Box textAlign="center" p="4">
			<Flex direction="column" justifyContent="center" alignItems="center" height="70vh">
				<Box mb="4">
					<Icon as={FaVoteYea} boxSize="50px" color="teal.500" />
					<Heading as="h1" fontSize="4xl" mt="4">
						Welcome to NFT-DAO
					</Heading>
					<Text fontSize="lg" mt="2">
						Welcome to your web3 community, please connect your wallet to continue.
					</Text>
				</Box>
				<ConnectButton />
			</Flex>
			<Box mt="8">
				<Text fontSize="sm" color="gray.500">
					© 2023 NFT-DAO. All rights reserved.
				</Text>
			</Box>
		</Box>
	);
};

export default NotConnected;
