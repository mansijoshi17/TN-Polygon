import { ethers } from "ethers";
import React, { useState, createContext } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

import { NotificationContext } from "./Notification";
import { networkDirectory, contracts } from "../config";
import streamFactory from "../abi/StreamFactory.json";
import moneyRouter from "../abi/MoneyRouter.json";
import { Framework } from "@superfluid-finance/sdk-core";

import { collection, addDoc, db } from "../firebase";

export const MoneyStreamingContext = createContext();

export const MoneyStreamingContextProvider = (props) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const { Moralis, user } = useMoralis();

  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications } = notificationContext;

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      customerAdd: "",
      token: "",
      chain: "mumbai",
      amount: "",
      period: "",
      sdate: 0,
      edate: 0,
    },
  });

  const setFormdata = (prop) => (event) => {
    setlabelInfo({
      ...labelInfo,
      formData: { ...labelInfo.formData, [prop]: event.target.value },
    });
  };

  const steps = [{ title: "Select Chain" }, { title: "Payment Details" }];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function getSeconds(dateValue) {
    const date = new Date(dateValue.toString());
    const seconds = Math.floor(date.getTime() / 1000);
    return seconds;
  }

  function calFlowRate(amt) {
    if (typeof Number(amt) !== "number" || isNaN(Number(amt)) === true) {
      throw new Error("calculate a flowRate based on a number");
    } else if (typeof Number(amt) === "number") {
      const monthlyAmount = ethers.utils.parseEther(amt.toString());
      console.log(monthlyAmount, "monthlyAmount");
      const calculatedFlowRate = Math.floor(monthlyAmount / 3600 / 24 / 30);
      return calculatedFlowRate;
    }
  }

  async function createPayment() {
    setLoading(true);
    try {
      const startDate = getSeconds(labelInfo.formData.sdate);
      const endDate = getSeconds(labelInfo.formData.edate);

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
      });
      console.log(labelInfo.formData.amount);
      const flowRate = calFlowRate(labelInfo.formData.amount);

      console.log(flowRate);

      try {
        const createFlowOperation = sf.cfaV1.createFlow({
          receiver: labelInfo.formData.customerAdd,
          flowRate: flowRate,
          superToken: labelInfo.formData.token,
          // userData?: string
        });

        console.log("Creating your stream...");

        const result = await createFlowOperation.exec(signer);

        console.log(
          `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${labelInfo.formData.token}
    Network: Kovan
    Super Token: ${labelInfo.formData.token}
    Sender: ${user?.attributes?.ethAddress}
    Receiver: ${labelInfo.formData.customerAdd},
    FlowRate: ${flowRate}
    `
        );
        if (result) {
          const docRef = await addDoc(collection(db, "payments"), {
            customerAddress: labelInfo.formData.customerAdd,
            token: labelInfo.formData.token,
            chain: labelInfo.formData.chain,
            amount: labelInfo.formData.amount,
            period: labelInfo.formData.period,
            sdate: startDate,
            edate: endDate,
          });
        }
      } catch (error) {
        console.log(
          "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
        );
        console.error(error);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MoneyStreamingContext.Provider
      value={{
        page,
        open,
        handleClickOpen,
        handleClose,
        steps,
        labelInfo,

        setFormdata,
        createPayment,
        loading,
      }}
    >
      {props.children}
    </MoneyStreamingContext.Provider>
  );
};
