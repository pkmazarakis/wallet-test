import { StyleSheet, View } from "react-native";
import { ethers } from "ethers";
import { RootTabScreenProps } from "../types";
import StyleGuide from "../StyleGuide.js";
import React from "react";

export default function Container({
  children,
}: RootTabScreenProps<"Home">): JSX.Element {
  //add padding to entire screen
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    padding: StyleGuide.Spacing.small,
  },
});
