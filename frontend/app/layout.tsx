import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ChakraUiWrapper } from "./components/chakra-ui-wrapper";
import { RainbowKitWrapper } from "./components/rainbowkit-wrapper";

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
				<RainbowKitWrapper>{children}</RainbowKitWrapper>
			</ChakraUiWrapper>
		</body>
	</html>
);

export default RootLayout;
