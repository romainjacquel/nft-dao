"use client";

import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { FaGrinStars } from "react-icons/fa";
import isAuth from "../components/is-auth";
import useHasMounted from "../hooks/use-has-mounted";
import useIsNFTHolder from "../hooks/use-is-nft-holder";

const Holder = () => {
	const hasMounted = useHasMounted();
	const { balance, isHolder } = useIsNFTHolder();

	useEffect(() => {
		if (!isHolder) {
			redirect("/bidding");
		}
	}, [isHolder]);

	return (
		hasMounted && (
			<Box textAlign="center" p="4">
				<Flex direction="column" justifyContent="center" alignItems="center" height="70vh">
					<Box mb="4">
						<Icon as={FaGrinStars} boxSize="50px" color="teal.500" />
						<Heading as="h1" fontSize="4xl" mt="4">
							Congratulation, you own {balance} NFT
						</Heading>
						<Text fontSize="lg" mt="2">
							You can now participate to our DAO
						</Text>
					</Box>
				</Flex>
			</Box>
		)
	);
};

export default isAuth(Holder);
