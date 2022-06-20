import { FlatList, StyleSheet, View } from "react-native";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { Button, IconButton, Text } from "react-native-paper";
import { RootTabScreenProps } from "../types";
import Container from "../components/Container";
import TokenInformation from "../components/TokenInformation";
import StyleGuide from "../StyleGuide";
import Transaction from "../components/Transaction";
import React from "react";
import { useEffect, useState } from "react";
import {
  API_KEY_TOKEN,
  ENDPOINT_URL,
  token_signer,
  wallet,
  wallet_address,
} from "../constants";
import axios from "axios";

export default function WalletTransactions({
  navigation,
}: RootTabScreenProps<"Home">) {
  const [normalTransactions, setNormalTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [eth, setEth] = useState();
  const [listContent, setListContent] = useState("eth");

  const getWalletTransactions = async () => {
    const eth = await axios
      .get(
        `${ENDPOINT_URL}?module=account&action=balance&address=${wallet_address}&tag=latest&apikey=${API_KEY_TOKEN}`
      )
      .then((value) => {
        console.log("HELLO");
        setEth(ethers.utils.formatEther(value.data.result));
      })
      .catch((error) => {
        console.log(error);
      });
    const transactions = await axios
      .get(
        `${ENDPOINT_URL}?module=account&action=tokentx&address=${wallet_address}&page=1&offset=100&startblock=0&endblock=27025780&sort=desc&apikey=${API_KEY_TOKEN}`
      )
      .then((value) => {
        console.log(value.data.result[0]);
        setTransactions(value.data.result);
      });
    const normalTransactions = await axios
      .get(
        `${ENDPOINT_URL}?module=account&action=txlist&address=${wallet_address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${API_KEY_TOKEN}`
      )
      .then((value) => {
        setNormalTransactions(value.data.result);
      });
  };

  useEffect(() => {
    getWalletTransactions();
  }, []);

  function timeSince(date: number | Date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  return (
    <Container style={styles.container}>
      <View style={styles.topTab}>
        <Button
          mode="outlined"
          labelStyle={{ color: StyleGuide.Colors.primary }}
          style={{
            width: "48%",
            backgroundColor:
              listContent === "eth" ? StyleGuide.Colors.secondary : null,
          }}
          onPress={() => {
            setListContent("eth");
          }}
        >
          ETH
        </Button>
        <Button
          mode="outlined"
          labelStyle={{ color: StyleGuide.Colors.primary }}
          style={{
            width: "48%",
            backgroundColor:
              listContent === "fau" ? StyleGuide.Colors.secondary : null,
          }}
          onPress={() => {
            setListContent("fau");
          }}
        >
          FAU
        </Button>
      </View>
      <Text style={styles.subtitle}>{`${
        listContent === "eth" ? normalTransactions.length : transactions.length
      } Transactions`}</Text>

      <FlatList
        data={listContent === "eth" ? normalTransactions : transactions}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => {
          const timestamp = item.item["timeStamp"];
          const new_date = new Date(timestamp * 1000);
          //   const date = new Date(item.item["timeStamp"]);
          const to = item.item["to"];
          const from = item.item["from"];
          console.log(item.item["value"]);
          return (
            <View>
              <View style={styles.transactionContainer}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {item.item["from"] === String(wallet_address.toLowerCase())
                      ? `Sent to ${String(to)}`
                      : `Received from ${String(from)}`}
                  </Text>
                  <Text>{`${timeSince(new_date)} ago`}</Text>
                </View>
                <View style={styles.rightSide}>
                  <Text style={styles.subtitle}>
                    {`${ethers.utils.formatEther(item.item["value"])} ${
                      listContent === "eth" ? "ETH" : "FAU"
                    }`}
                  </Text>
                  {item.item["from"] ===
                  String(wallet_address.toLowerCase()) ? (
                    <Text style={styles.outTag}>OUT</Text>
                  ) : (
                    // <IconButton
                    //   icon={"logout"}
                    //   color={StyleGuide.Colors.primary}
                    // />
                    <Text style={styles.inTag}>IN</Text>

                    // <IconButton
                    //   icon={"login"}
                    //   color={StyleGuide.Colors.primary}
                    // />
                  )}
                </View>
              </View>
              <Text>{`Block Number: ${item.item["blockNumber"]}`}</Text>
            </View>
          );
        }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: StyleGuide.FontWeight.bold,
    marginTop: StyleGuide.Spacing.small,
    color: StyleGuide.Colors.primary,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  holdings: {},
  transactionContainer: {
    borderRadius: StyleGuide.Spacing.borderRadius,
    borderColor: StyleGuide.Colors.darkGrey,
    color: StyleGuide.Colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: StyleGuide.Spacing.small,
    borderWidth: 2,
    marginTop: StyleGuide.Spacing.small,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: StyleGuide.FontWeight.normal,
    color: StyleGuide.Colors.primary,
    overflow: "hidden",
    // marginTop: StyleGuide.Spacing.small,
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  outTag: {
    borderRadius: StyleGuide.Spacing.borderRadius,
    backgroundColor: StyleGuide.Colors.lightWarning,
    color: StyleGuide.Colors.warning,
    padding: StyleGuide.Spacing.tiny,
    fontSize: 14,
    fontWeight: StyleGuide.FontWeight.bold,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 50,
    textAlign: "center",
    marginLeft: StyleGuide.Spacing.tiny,
  },
  inTag: {
    borderRadius: StyleGuide.Spacing.borderRadius,
    backgroundColor: StyleGuide.Colors.lightSuccess,
    color: StyleGuide.Colors.success,
    padding: StyleGuide.Spacing.tiny,
    fontSize: 14,
    fontWeight: StyleGuide.FontWeight.bold,
    width: 50,
    textAlign: "center",
    marginLeft: StyleGuide.Spacing.tiny,
  },
  topTab: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: StyleGuide.Spacing.small,
    // flex: 1,
  },
});
