import { FlatList, StyleSheet, View } from "react-native";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { Text } from "react-native-paper";
import { RootTabScreenProps } from "../types";
import Container from "../components/Container";
import TokenInformation from "../components/TokenInformation";
import StyleGuide from "../StyleGuide";
import Transaction from "../components/Transaction";
import React from "react";
import { useEffect, useState } from "react";
import { setBackgroundColorAsync } from "expo-system-ui";
import {
  token_address,
  ERC20_ABI,
  provider,
  wallet_address,
} from "../constants";

const DATA = [
  {
    name: "Solana",
    abbreviation: "SOL",
    usdAmount: 100,
    numTokens: 10,
    image: "solana-logo.png",
  },
  {
    name: "Solana",
    abbreviation: "ETG",
    usdAmount: 100,
    numTokens: 10,
    image: "solana-logo.png",
  },
  {
    name: "Solana",
    abbreviation: "FAU",
    usdAmount: 100,
    numTokens: 10,
    image: "solana-logo.png",
  },
];

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const [fau, setFau] = useState([]);
  const [eth, setEth] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  const getFAU = async () => {
    const contract = new ethers.Contract(token_address, ERC20_ABI, provider);

    const name = await contract.name();
    const abbreviation = await contract.symbol();
    const numTokens = await contract.balanceOf(wallet_address);
    //   const name = await contract.name();

    setFau({
      name,
      abbreviation,
      numTokens: ethers.utils.formatEther(numTokens),
      usdAmount: 100,
      image: "ethereum-logo.png",
    });
  };

  const getEthereum = async () => {
    const balance = await provider.getBalance(wallet_address);
    setEth({
      name: "Ethereum",
      abbreviation: "ETH",
      numTokens: ethers.utils.formatEther(balance),
      usdAmount: 100,
      image: "ethereum-logo.png",
    });
  };

  useEffect(() => {
    getFAU();
    getEthereum();
  }, []);

  const handleReloadHome = () => {
    getFAU();
    getEthereum();
  };

  return (
    <Container style={styles.container}>
      <Text style={styles.title}>Current Holdings</Text>
      <TokenInformation
        name={fau.name}
        image={fau.image}
        usdAmount={fau.usdAmount}
        numTokens={fau.numTokens}
        abbreviation={fau.abbreviation}
      />
      <TokenInformation
        name={eth.name}
        image={eth.image}
        usdAmount={eth.usdAmount}
        numTokens={eth.numTokens}
        abbreviation={eth.abbreviation}
      />
      <Text style={styles.title}>Send FAU</Text>
      <Transaction handleReloadHome={handleReloadHome} eth={eth} fau={fau} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: StyleGuide.Spacing.small,
    color: StyleGuide.Colors.primary,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  holdings: {},
});
