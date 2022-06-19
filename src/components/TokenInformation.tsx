import * as WebBrowser from "expo-web-browser";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import StyleGuide from "../StyleGuide";
import { MonoText } from "../glovebox/Text";
import React from "react";

export default function TokenInformation({
  name,
  numTokens,
  abbreviation,
}: {
  name: string;
  image: string;
  usdAmount: number;
  numTokens: number;
  abbreviation: string;
}) {
  //Displays wallet information
  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <Image
          source={require(`../assets/images/ethereum-logo.png`)}
          style={styles.logo}
        />
        <View>
          <MonoText style={styles.title}>{name}</MonoText>
          <MonoText style={styles.subtitle}>{abbreviation}</MonoText>
        </View>
      </View>
      <View style={styles.rightSide}>
        <MonoText style={styles.rightText} numberOfLines={1}>
          {Number(numTokens).toPrecision(5) + abbreviation}
        </MonoText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: StyleGuide.Spacing.small,
    width: "100%",
    flexGrow: 0,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSide: {
    // justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  logo: {
    width: StyleGuide.Icons.medium,
    height: StyleGuide.Icons.medium,
    marginRight: StyleGuide.Spacing.small,
  },
  title: {
    fontSize: StyleGuide.Font.regular,
    fontFamily: "space-mono",
    fontWeight: StyleGuide.FontWeight.bold,
    color: StyleGuide.Colors.primary,
  },
  rightText: {
    fontWeight: StyleGuide.FontWeight.normal,
    fontSize: StyleGuide.Font.small,
    color: StyleGuide.Colors.primary,
  },
  subtitle: {
    color: StyleGuide.Colors.darkGrey,
  },
});
