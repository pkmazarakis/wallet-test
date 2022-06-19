import { useHeaderHeight } from "@react-navigation/elements";
import { TextInput, Button, Text } from "react-native-paper";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { StyleSheet, KeyboardAvoidingView, View } from "react-native";
import StyleGuide from "../StyleGuide";
import { useState } from "react";
import React from "react";
import {
  provider,
  wallet_address,
  contract,
  token_address,
  ERC20_ABI,
  wallet,
} from "../constants";
export default function Transaction({
  handleReloadHome,
  eth,
  fau,
}: {
  handleReloadHome: Function;
  eth: number;
  fau: number;
}) {
  const [address, setAddress] = useState(
    "0xcdc53223339F57545DC73509E7b9d54F90959aDF"
  );
  const [amount, setAmount] = useState("");
  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [approved, setApproved] = useState(false);
  const [actionError, setActionError] = useState("");
  const [gasEstimate, setGasEstimate] = useState("");

  const estimate_gas = async () => {
    const gasPrice = parseInt((await provider.getGasPrice())._hex, 16);
    const token_signer = wallet.connect(provider);
    const token_amount = ethers.utils.parseUnits(amount.toString(), 18);
    const contract_signer = new ethers.Contract(
      token_address,
      ERC20_ABI,
      token_signer
    );

    //calculate gas estimates
    const gas_estimate = await contract_signer.estimateGas
      .transfer("0xcdc53223339F57545DC73509E7b9d54F90959aDF", token_amount)
      .then((value) => {
        const gas = gasPrice * parseInt(value._hex, 16);
        setGasEstimate(ethers.utils.formatEther(gas));
        setApproved(true);
        setLoadingApprove(false);
      })
      .catch(() => {
        if (gasEstimate > eth.numTokens || amount > fau.numTokens) {
          setActionError("not enough funds");
          setLoadingApprove(false);
        }
      });

    //performs a dry run of transaction. Used to check if transaction will be successful
    const tx = await contract_signer.callStatic
      .transfer("0xcdc53223339F57545DC73509E7b9d54F90959aDF", token_amount)
      .then(() => {
        setApproved(true);
        setLoadingApprove(false);
      })
      .catch((error: any) => {
        if (gasEstimate > eth.numTokens || amount > fau.numTokens) {
          setActionError("not enough funds");
        } else {
          setActionError(error.message);
        }
        setLoadingApprove(false);
      });
  };

  //Transfers FAU ERC20 token to wallet address inputted
  const transfer_fau = async () => {
    const token_signer = contract.connect(wallet);
    const token_amount = ethers.utils.parseUnits(amount.toString(), 18);
    setLoadingTransfer(true);
    setActionError("");
    const transaction = await token_signer
      .transfer(address, token_amount)
      .catch((error: any) => {
        setActionError(error.message);
        setLoadingTransfer(false);
        console.log(error);
      });
    await transaction.wait();
    handleReloadHome();
    setTransactionSuccess(true);
    setAmount("");
    setGasEstimate("");
    setTimeout(() => {
      setTransactionSuccess(false);
    }, 3000);
    setLoadingTransfer(false);

    console.log(transaction);
  };

  const approve_transaction = async () => {
    const token_amount = ethers.utils.parseUnits(amount.toString(), 18);

    const approval = await contract.approve(wallet_address, token_amount);
    await approval.wait();
    console.log(approval);
  };

  //in case developer wants to send ETH instead of FAU. Increase the scope to transferring different tokens
  const create_transactions = async () => {
    //send ether
    const send_money = await wallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(amount.toString()),
    });

    //wait for transaction to be mined
    await send_money.wait();
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={useHeaderHeight() + 20}
      behavior="padding"
      style={styles.container}
    >
      <TextInput
        mode="outlined"
        label="Wallet Address"
        activeOutlineColor={StyleGuide.Colors.primary}
        underlineColor={StyleGuide.Colors.primary}
        error={addressError}
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          setAddressError(false);
          setActionError("");
        }}
        style={styles.textInput}
      />
      <TextInput
        label="Amount"
        mode="outlined"
        value={amount}
        error={amountError}
        onChangeText={(text) => {
          setAmount(text);
          setAmountError(false);
          setActionError("");
        }}
        activeOutlineColor={StyleGuide.Colors.primary}
        underlineColor={StyleGuide.Colors.primary}
        keyboardType={"decimal-pad"}
        style={styles.textInput}
      />
      {actionError !== "" ? (
        <Text style={styles.error} numberOfLines={1}>
          {actionError}
        </Text>
      ) : null}
      {gasEstimate !== "" ? (
        <Text style={styles.gasEstimate} numberOfLines={1}>
          {`Gas (estimated): ${gasEstimate}`}
        </Text>
      ) : null}

      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          style={styles.button}
          loading={loadingApprove}
          icon={approved ? "check" : null}
          labelStyle={styles.label}
          onPress={() => {
            if (amount !== "" && address !== "") {
              setLoadingApprove(true);
              estimate_gas();
              setActionError("");
            } else {
              if (amount === "") {
                setAmountError(true);
              } else if (address === "") {
                setAddressError(true);
              }
              setActionError("missing inputs");
            }

            // approve_transaction();
          }}
        >
          <Text style={{ color: StyleGuide.Colors.primary }}>Approve</Text>
        </Button>
        <Button
          mode="contained"
          style={{
            width: "48%",
            height: 50,
            textAlign: "center",
            alignSelf: "center",
            justifyContent: "center",
            backgroundColor:
              !approved && !transactionSuccess
                ? StyleGuide.Colors.tertiary
                : StyleGuide.Colors.secondary,
            borderRadius: 100,
          }}
          labelStyle={styles.label}
          icon={transactionSuccess ? "check" : null}
          loading={loadingTransfer}
          onPress={() => {
            if (!approved) {
              setActionError("need to approve token");
            } else {
              transfer_fau();
              setApproved(false);
            }
          }}
        >
          <Text style={{ color: StyleGuide.Colors.primary }}>
            {transactionSuccess ? "Sent!" : "Transfer"}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "100%",
    marginTop: StyleGuide.Spacing.small,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSide: {
    alignItems: "flex-end",
  },
  logo: {
    width: StyleGuide.Icons.medium,
    height: StyleGuide.Icons.medium,
    marginRight: StyleGuide.Spacing.small,
  },
  textInput: {
    marginBottom: StyleGuide.Spacing.small,
  },
  actionButtons: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  button: {
    width: "48%",
    height: 50,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    color: StyleGuide.Colors.primary,
  },
  error: {
    color: StyleGuide.Colors.error,
    marginBottom: StyleGuide.Spacing.small,
  },
  gasEstimate: {
    color: StyleGuide.Colors.primary,
    marginBottom: StyleGuide.Spacing.small,
  },
  label: { color: StyleGuide.Colors.primary },
});
