import { ethers } from "ethers";
import React, { useState, createContext } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import {
  chainLinkPriceFeed,
  RandomNumberGeneratorContract,
} from "../contracts/contract";
import chainlinkABI from "../abi/chinlinkPrice.json";
import chainlinkVRFABI from "../abi/chainlinkVRF.json";

import { collection, addDoc, db } from "../firebase";

import { firebaseDataContext } from "src/context/FirebaseDataContext";

export const InvoicContext = createContext();

export const InvoiceContextProvider = (props) => {
  const { user } = useMoralis();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [randomNumber, setRandomNumber] = useState();
  const [updated, setUpdated] = useState(false);

  const firebaseContext = React.useContext(firebaseDataContext);
  const { customers } = firebaseContext;

  window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const priceFeed = new ethers.Contract(
    chainLinkPriceFeed,
    chainlinkABI,
    signer
  );
  const randomNumberCon = new ethers.Contract(
    RandomNumberGeneratorContract,
    chainlinkVRFABI.abi,
    signer
  );

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      description: "",
      quantity: "",
      price: "",
      token: "",
      network: "",
      name: "",
      to: "",
      taxName: "",
      taxPercentage: "",
      note: "",
    },
  });

  const setFormdata = (prop) => (event) => {
    setlabelInfo({
      ...labelInfo,
      formData: { ...labelInfo.formData, [prop]: event.target.value },
    });
  };

  const steps = [
    { title: "Product/Service Details" },
    { title: "Customer & Tax Details" },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function createInvoice() {
    setLoading(true);
    const customer =
      customers &&
      customers.filter((cus) => cus.address == labelInfo.formData.to);

    await randomNumberCon.getRandomNumber(1000);
    const randNo = await randomNumberCon.getRandom();

    try {
      const docRef = await addDoc(collection(db, "invoices"), {
        invoiceNumber: parseInt(randNo._hex, 16),
        description: labelInfo.formData.description,
        quantity: parseInt(labelInfo.formData.quantity),
        price: parseInt(labelInfo.formData.price),
        token: labelInfo.formData.token,
        network: labelInfo.formData.network,
        name: customer[0].name,
        from: user?.attributes?.ethAddress,
        to: labelInfo.formData.to,
        taxName: labelInfo.formData.taxName,
        taxPercentage: parseInt(labelInfo.formData.taxPercentage),
        note: labelInfo.formData.note,
        created: new Date(),
        paid: false,
      });

      setLoading(false);
      setUpdated(!updated);
      toast.success("Successfully Invoice created!!");
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast.error("Something went wrong!");
    }
  }

  return (
    <InvoicContext.Provider
      value={{
        page,
        open,
        handleClickOpen,
        handleClose,
        steps,
        labelInfo,

        setFormdata,
        loading,
        createInvoice,
        updated,
      }}
    >
      {props.children}
    </InvoicContext.Provider>
  );
};