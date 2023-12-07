"use client";

import { Flex, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NextLink from "next/link";
import useIsNFTHolder from "../hooks/use-is-nft-holder";

const Header = () => {
	const { isHolder } = useIsNFTHolder();

	return (
		<Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white">
			<Text fontSize="25" fontWeight="bold">
				NFT-DAO
			</Text>
			<Flex align="center" justify="space-between" direction="row" pt={[4, 4, 0, 0]} gap={8}>
				<Link as={NextLink} fontSize="18" href="/bidding">
					Bidding
				</Link>
				{isHolder && (
					<Link as={NextLink} fontSize="18" href="/holder">
						Holder
					</Link>
				)}
				<ConnectButton />
			</Flex>
		</Flex>
	);
};

export default Header;
