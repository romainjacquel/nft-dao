import { Container } from "@chakra-ui/react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ChakraUiWrapper } from "./components/chakra-ui-wrapper";
import Header from "./components/headers";
import { RainbowKitWrapper } from "./components/rainbowkit-wrapper";
import { AppContextWrapper } from "./context/app-context";

type RootLayoutProps = {
	children: ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "NFT DAO",
	description: "NFT BY ROMAIN JACQUEL",
};

const RootLayout = ({ children }: RootLayoutProps) => (
	<html lang="en">
		<body className={inter.className}>
			<ChakraUiWrapper>
				<RainbowKitWrapper>
					<AppContextWrapper>
						<Header />
						<Container maxW="70%">{children}</Container>
					</AppContextWrapper>
				</RainbowKitWrapper>
			</ChakraUiWrapper>
		</body>
	</html>
);

export default RootLayout;
