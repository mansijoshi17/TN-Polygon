import { ethers } from "ethers";
import React, { useState, createContext } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

import { NotificationContext } from "./Notification";
import { networkDirectory } from "../config";

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

  console.log(labelInfo.formData);

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
        loading,
      }}
    >
      {props.children}
    </MoneyStreamingContext.Provider>
  );
};
