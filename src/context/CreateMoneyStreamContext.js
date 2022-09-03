import { ethers } from "ethers";
import React, { useState, createContext } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

import { NotificationContext } from "./Notification";
import { networkDirectory, contracts } from "../config"; 
import { Framework } from "@superfluid-finance/sdk-core";
import { SuperfluidContext } from "./SuperFluideContext";

export const MoneyStreamingContext = createContext();

export const MoneyStreamingContextProvider = (props) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const { Moralis, user } = useMoralis();

  const superfluidContext = React.useContext(SuperfluidContext);
  const { createStream } = superfluidContext;

  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications } = notificationContext;

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      customerAdd: "",
      token: "",
      chain: "80001",
      amount: "",
      period: "",
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

  async function createPayment() {
    setLoading(true);
    try {
      let res = await createStream(labelInfo.formData);
      handleClose();
      setLoading(false);
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      setLoading(false);
      console.error(error);
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
