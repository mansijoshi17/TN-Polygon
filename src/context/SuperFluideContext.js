import React, { useState, createContext, useEffect, useCallback } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { useMoralis } from "react-moralis";
import { Framework, createSkipPaging } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

import Web3 from "web3";

import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { gql } from "graphql-request";
import { networks } from "../redux/networks";
import { sfSubgraph, sfApi } from "../redux/store";
import { toast } from "react-toastify";
import { Daix } from "../contracts/Daix";

import { firebaseDataContext } from "./FirebaseDataContext";

import {
  collection,
  addDoc,
  getDocs,
  db,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "../firebase";

export const SuperfluidContext = createContext(undefined);

export const SuperfluidContextProvider = (props) => {
  const { user } = useMoralis();
  const [provider, setProvider] = useState({});
  const [sf, setSf] = useState({});
  const [signer, setSigner] = useState();
  const [chain, setChain] = useState();
  const [isUpdatedctx, setIsUpdated] = useState(false);

  const [inFlows, setInFlows] = useState([]);
  const [outFlows, setOutFlows] = useState([]);

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getPayments, payments } = firebaseContext;

  useEffect(() => {
    initWeb3();
  }, []);

  // function loadFlow(data) {
  //   const date = new Date();
  //   const currentTime = Math.floor(date.getTime() / 1000);

  //   let stopAnimation = false;
  //   let lastAnimationTimestamp = 0;

  //   const animationStep = (currentAnimationTimestamp) => {
  //     if (
  //       currentAnimationTimestamp - lastAnimationTimestamp >
  //       ANIMATION_MINIMUM_STEP_TIME
  //     ) {
  //       if (stopAnimation) {
  //         return;
  //       }

  //       let val =
  //         data.streamedUntilUpdatedAt +
  //         (currentTime - data.updatedAtTimestamp) * data.currentFlowRate;
  //       console.log(val);

  //       lastAnimationTimestamp = currentAnimationTimestamp;
  //     }
  //     window.requestAnimationFrame(animationStep);
  //   };
  //   window.requestAnimationFrame(animationStep);
  // }

  async function initWeb3() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });
    setProvider(provider);
    setSf(sf);
    setChain(Number(chainId));
    setSigner(signer);
  }

  function calFlowRate(amt, days) {
    if (typeof Number(amt) !== "number" || isNaN(Number(amt)) === true) {
      throw new Error("calculate a flowRate based on a number");
    } else if (typeof Number(amt) === "number") {
      const monthlyAmount = ethers.utils.parseEther(amt.toString());
      console.log(monthlyAmount, "monthlyAmount");
      const calculatedFlowRate = Math.floor(monthlyAmount / 3600 / 24 / days);
      return calculatedFlowRate;
    }
  }

  function getSeconds(dateValue) {
    const date = new Date(dateValue.toString());
    const seconds = Math.floor(date.getTime() / 1000);
    return seconds;
  }
  let flowRate;
  async function createStream(stream) {
    if (stream.period == "Month") {
      flowRate = calFlowRate(stream.amount, 30);
    } else if (stream.period == "Year") {
      flowRate = calFlowRate(stream.amount, 365);
    } else {
      flowRate = calFlowRate(stream.amount, 7);
    }

    console.log(flowRate, "flowRate");
    const startDate = getSeconds(stream.sdate);
    const endDate = getSeconds(stream.edate);

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        receiver: stream.customerAdd,
        flowRate: flowRate,
        superToken: stream.token,
        // userData?: string
      });

      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(signer);

      if (result) {
        const docRef = await addDoc(collection(db, "payments"), {
          customerAddress: stream.customerAdd,
          sender: user?.attributes?.ethAddress,
          token: stream.token,
          chain: stream.chain,
          amount: stream.amount,
          period: stream.period,
          sdate: startDate,
          edate: endDate,
        });
        await getPayments();
        await listOutFlows();
        setIsUpdated(!isUpdatedctx);
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStream(stream, newAmount) {
    let flowRate;
    if (stream.period == "Month") {
      flowRate = calFlowRate(newAmount, 30);
    } else if (stream.period == "Year") {
      flowRate = calFlowRate(newAmount, 365);
    } else {
      flowRate = calFlowRate(newAmount, 7);
    }

    try {
      const updateFlowOperation = await sf.cfaV1.updateFlow({
        flowRate: flowRate,
        receiver: stream.receiver,
        superToken: stream.token,
        // userData?: string
      });

      console.log("Updating your stream...");

      const result = await updateFlowOperation.exec(signer);

      if (result) {
        const docRef = doc(db, "payments", stream?.id?.toString());
        await updateDoc(docRef, {
          amount: newAmount,
        });
        await getPayments();
        await listOutFlows();
        setIsUpdated(!isUpdatedctx);
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  function calculateStream(flowRate, days) {
    const stream = new BigNumber(flowRate * (86400 * days)).shiftedBy(-18);
    return stream.toFixed(2);
  }

  async function listOutFlows() {
    try {
      let outFlow = [];

      for (let i = 0; i < payments.length; i++) {
        let payment = payments[i];
        console.log(payment, "payment");
        if (payment.sender.toLowerCase() == user?.attributes?.ethAddress) {
          let obj;
          const getFlowOperation = await sf.cfaV1.getFlow({
            superToken: payment.token,
            sender: payment.sender,
            receiver: payment.customerAddress,
            providerOrSigner: provider,
          });
          const flowData = await sf.query.listStreams({
            sender: payment.sender,
            receiver: payment.customerAddress,
            token: payment.token,
          });

          let amount;
          if (payment.period == "Month") {
            amount = calculateStream(getFlowOperation.flowRate, 30);
          } else if (payment.period == "Year") {
            amount = calculateStream(getFlowOperation.flowRate, 365);
          } else {
            amount = calculateStream(getFlowOperation.flowRate, 7);
          }

          obj = {
            id: payment.id,
            sender: payment.sender,
            receiver: payment.customerAddress,
            amount: amount,
            period: payment.period,
            streamedUntilUpdatedAt: flowData?.data[0]?.streamedUntilUpdatedAt,
            updatedAtTimestamp: flowData?.data[0]?.updatedAtTimestamp,
            currentFlowRate: flowData?.data[0]?.currentFlowRate,
            token: payment.token,
          };
          outFlow.push(obj);
        } else {
          console.log("No outgoing streams");
        }
      }
      setOutFlows(outFlow);
    } catch (error) {
      console.log(error);
    }
  }

  async function listInFlows() {
    let inFlow = [];
    for (let i = 0; i < payments.length; i++) {
      let payment = payments[i];

      if (
        payment.customerAddress.toLowerCase() == user?.attributes?.ethAddress
      ) {
        let obj;
        const getFlowOperation = await sf.cfaV1.getFlow({
          superToken: payment.token,
          sender: payment.sender,
          receiver: payment.customerAddress,
          providerOrSigner: provider,
        });
        const flowData = await sf.query.listStreams({
          sender: payment.sender,
          receiver: payment.customerAddress,
          token: payment.token,
        });
        let amount;
        if (payment.period == "Month") {
          amount = calculateStream(getFlowOperation.flowRate, 30);
        } else if (payment.period == "Year") {
          amount = calculateStream(getFlowOperation.flowRate, 365);
        } else {
          amount = calculateStream(getFlowOperation.flowRate, 7);
        }

        obj = {
          id: payment.id,
          sender: payment.sender,
          receiver: payment.customerAddress,
          amount: amount,
          period: payment.period,
          streamedUntilUpdatedAt: flowData?.data[0]?.streamedUntilUpdatedAt,
          updatedAtTimestamp: flowData?.data[0]?.updatedAtTimestamp,
          currentFlowRate: flowData?.data[0]?.currentFlowRate,
          token: payment.token,
        };
        inFlow.push(obj);
      } else {
        console.log("No incoming streams");
      }
    }
    setInFlows(inFlow);
  }

  async function deleteFlow(streamData) {
    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: streamData.sender,
        receiver: streamData.receiver,
        superToken: streamData.token,
        // userData?: string
      });
      let result = await deleteFlowOperation.exec(signer);
      if (result) {
        const docRef = doc(db, "payments", streamData?.id?.toString());
        console.log(docRef);

        deleteDoc(docRef)
          .then(() => {
            console.log("Entire Document has been deleted successfully.");
          })
          .catch((error) => {
            console.log(error);
          });
        setIsUpdated(!isUpdatedctx);
        await getPayments();
        await listOutFlows();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SuperfluidContext.Provider
      value={{
        createStream,
        updateStream,
        listOutFlows,
        listInFlows,
        deleteFlow,
        sf,
        isUpdatedctx,
        outFlows,
        inFlows,
      }}
      {...props}
    >
      {props.children}
    </SuperfluidContext.Provider>
  );
};
