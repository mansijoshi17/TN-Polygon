import React, { useState, createContext, useEffect, useCallback } from "react";

import { useMoralis } from "react-moralis";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

import BigNumber from "bignumber.js";

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
import { toast } from "react-toastify";

export const SuperfluidContext = createContext(undefined);

export const SuperfluidContextProvider = (props) => {
  const { user } = useMoralis();
  const [provider, setProvider] = useState({});
  const [sf, setSf] = useState({});
  const [signer, setSigner] = useState();
  const [chain, setChain] = useState();
  const [isUpdatedctx, setIsUpdated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [inFlows, setInFlows] = useState([]);
  const [outFlows, setOutFlows] = useState([]);

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getPayments, payments } = firebaseContext;

  useEffect(() => {
    initWeb3();
  }, []);

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
      const calculatedFlowRate = Math.floor(monthlyAmount / 3600 / 24 / days); // 3600 - 1 hour
      return calculatedFlowRate;
    }
  }

  function calFlowRateForHour(amt) {
    if (typeof Number(amt) !== "number" || isNaN(Number(amt)) === true) {
      throw new Error("calculate a flowRate based on a number");
    } else if (typeof Number(amt) === "number") {
      const monthlyAmount = ethers.utils.parseEther(amt.toString());

      const calculatedFlowRate = Math.floor(monthlyAmount / 60 / 60);
      return calculatedFlowRate;
    }
  }

  function getSeconds(dateValue) {
    0 - 9;
    const date = new Date(dateValue.toString());
    const seconds = Math.floor(date.getTime() / 1000);
    return seconds;
  }
  let flowRate;
  async function createStream(stream) {
    if (stream.period == "One Time") {
      const id = Math.floor(Math.random() * 1000000000);
      await oneTimePayment({
        index: id,
        subscriber: stream.customerAdd,
        units: 10,
        amount: stream.amount,
        superToken: stream.token,
        chain: stream.chain,
        period: stream.period,
      });
    } else {
      if (stream.period == "Monthly") {
        flowRate = calFlowRate(stream.amount, 30);
      } else if (stream.period == "Yearly") {
        flowRate = calFlowRate(stream.amount, 365);
      } else if (stream.period == "Weekly") {
        flowRate = calFlowRate(stream.amount, 7);
      } else if (stream.period == "Daily") {
        flowRate = calFlowRate(stream.amount, 1);
      } else {
        flowRate = calFlowRateForHour(stream.amount);
      }

      try {
        const createFlowOperation = sf.cfaV1.createFlow({
          receiver: stream.customerAdd,
          flowRate: flowRate,
          superToken: stream.token,
          // userData?: string
        });

        const createTransaction = await createFlowOperation.exec(signer);
        const txc = await createTransaction.wait();

        if (txc) {
          const docRef = await addDoc(collection(db, "payments"), {
            customerAddress: stream.customerAdd,
            sender: user?.attributes?.ethAddress,
            token: stream.token,
            chain: stream.chain,
            amount: stream.amount,
            period: stream.period,
          });
          toast.success("Successfully created recurring payment!");
          await getPayments();
          await listOutFlows();
          setIsUpdated(!isUpdatedctx);
        }

        return txc;
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error);
      }
    }
  }

  async function updateStream(stream, newAmount) {
    let flowRate;
    if (stream.period == "Monthly") {
      flowRate = calFlowRate(newAmount, 30);
    } else if (stream.period == "Yearly") {
      flowRate = calFlowRate(newAmount, 365);
    } else if (stream.period == "Weekly") {
      flowRate = calFlowRate(newAmount, 7);
    } else if (stream.period == "Daily") {
      flowRate = calFlowRate(newAmount, 1);
    } else {
      flowRate = calFlowRateForHour(newAmount);
    }

    try {
      const updateFlowOperation = await sf.cfaV1.updateFlow({
        flowRate: flowRate,
        receiver: stream.receiver,
        superToken: stream.token,
        // userData?: string
      });

      const updateTransaction = await updateFlowOperation.exec(signer);
      const txu = await updateTransaction.wait();

      if (txu) {
        const docRef = doc(db, "payments", stream?.id?.toString());
        await updateDoc(docRef, {
          amount: newAmount,
        });
        toast.success("Successfully updated recurring payment!");
        await getPayments();
        await listOutFlows();
        setIsUpdated(!isUpdatedctx);
      }

      return txu;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  function calculateStream(flowRate, days) {
    const stream = new BigNumber(flowRate * (86400 * days)).shiftedBy(-18); // 86400 - 1 day
    return stream.toFixed(2);
  }

  function calculateHourStream(flowRate) {
    const stream = new BigNumber(flowRate * (60 * 60)).shiftedBy(-18);
    return stream.toFixed(2);
  }

  async function listOutFlows() {
    setIsLoaded(true);
    try {
      let outFlow = []; 
      for (let i = 0; i < payments.length; i++) {
        let payment = payments[i];
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
          if (payment.period == "Monthly") {
            amount = calculateStream(getFlowOperation.flowRate, 30);
          } else if (payment.period == "Yearly") {
            amount = calculateStream(getFlowOperation.flowRate, 365);
          } else if (payment.period == "Weekly") {
            amount = calculateStream(getFlowOperation.flowRate, 7);
          } else if (payment.period == "Daily") {
            amount = calculateStream(getFlowOperation.flowRate, 1);
          } else if (payment.period == "One Time") {
            amount = payment.amount;
          } else {
            amount = calculateHourStream(getFlowOperation.flowRate);
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
      setIsLoaded(false);
    } catch (error) {
      console.log(error);
      setIsLoaded(false);
    }
  }

  async function listInFlows() {
    setIsLoaded(true);
    let inFlow = []; 
    try {
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
          if (payment.period == "Monthly") {
            amount = calculateStream(getFlowOperation.flowRate, 30);
          } else if (payment.period == "Yearly") {
            amount = calculateStream(getFlowOperation.flowRate, 365);
          } else if (payment.period == "Weekly") {
            amount = calculateStream(getFlowOperation.flowRate, 7);
          } else if (payment.period == "Daily") {
            amount = calculateStream(getFlowOperation.flowRate, 1);
          } else if (payment.period == "One Time") {
            amount = payment.amount;
          } else {
            amount = calculateHourStream(getFlowOperation.flowRate);
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
      setIsLoaded(false);
    } catch (error) {
      console.log(error);
      setIsLoaded(false);
    }
  }

  async function deleteFlow(streamData) {
    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: streamData.sender,
        receiver: streamData.receiver,
        superToken: streamData.token,
        // userData?: string
      });

      let deleteTransaction = await deleteFlowOperation.exec(signer);

      let txd = await deleteTransaction.wait();
      if (txd) {
        const docRef = doc(db, "payments", streamData?.id?.toString());

        deleteDoc(docRef)
          .then(async () => {
            toast.success("Successfully deleted payment!!");
            setIsUpdated(!isUpdatedctx);
            await getPayments();
            await listOutFlows();
            console.log("Entire Document has been deleted successfully.");
          })
          .catch((error) => {
            toast.error("Something went wrong!");
            console.log(error);
          });
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  }

  async function oneTimePayment(formData) {
    try {
      // Create Index
      const createIndexOperation = sf.idaV1.createIndex({
        indexId: formData.index,
        superToken: formData.superToken,
      });

      let transactionCreateIndex = await createIndexOperation.exec(signer);
      let txci = await transactionCreateIndex.wait();

      if (txci) {
        // update subscriber
        const updateSubscriptionOperation = sf.idaV1.updateSubscriptionUnits({
          indexId: formData.index,
          superToken: formData.superToken,
          subscriber: formData.subscriber,
          units: formData.units,
        });

        let transactionUpdateSubscriber =
          await updateSubscriptionOperation.exec(signer);
        let txus = await transactionUpdateSubscriber.wait();
        if (txus) {
          const distributeOperation = sf.idaV1.distribute({
            indexId: formData.index,
            superToken: formData.superToken,
            amount: ethers.utils
              .parseUnits(formData.amount.toString(), "ether")
              .toString(),
            // userData?: string
          });
          let transactionDistribute = await distributeOperation.exec(signer);
          let txd = await transactionDistribute.wait();
          if (txd) {
            const claimOperation = sf.idaV1.claim({
              indexId: formData.index,
              superToken: formData.superToken,
              subscriber: formData.subscriber,
              publisher: user?.attributes?.ethAddress,
              // userData?: string
            });
            let transactionClaim = await claimOperation.exec(signer);
            let txc = await transactionClaim.wait();
            if (txc) {
              const docRef = await addDoc(collection(db, "payments"), {
                customerAddress: formData.subscriber,
                sender: user?.attributes?.ethAddress,
                token: formData.superToken,
                chain: formData.chain,
                amount: formData.amount,
                period: formData.period,
              });

              toast.success("One Time payment Created successfully");
              await getPayments();
              await listOutFlows();
              setIsUpdated(!isUpdatedctx);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
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
        isLoaded,
      }}
      {...props}
    >
      {props.children}
    </SuperfluidContext.Provider>
  );
};
