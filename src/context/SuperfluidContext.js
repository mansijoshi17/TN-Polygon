import React, { useState, createContext, useEffect, useCallback } from "react";

import { useMoralis } from "react-moralis";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom"; 

import { gql } from "graphql-request"; 
import { toast } from "react-toastify"; 
import { Daix } from "src/pages/contracts/Daix";
 

export const SuperfluidWeb3Context = createContext(undefined);

export const url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`;
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
const USDCx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";
 
 

export const SuperfluidWeb3ContextProvider = (props) => {
  const [isLoadingcon, setIsLoaing] = useState(false);
  const { user,Moralis } = useMoralis();
  const navigate = useNavigate();
  const [totalStreams, setTotalStreams] = useState(0);
  const [flow, setFlow] = useState();
  const [subAddress,setSubAddress]= useState("");
  const [subTotal , setSubTotal ] = useState(0);
  const [subflow, setSubFlow] = useState();


const getSubAddress=(add)=>{
  setSubAddress(add);
}

 async function getUSDCXBalance(
  provider ,
  subAddress, 
) {
  const signer = provider.getSigner(subAddress);
  const contract = new ethers.Contract(USDCx, Daix, signer);
  let result = await contract.balanceOf(subAddress);
  return ethers.utils.formatEther(result);
} 
  async function outgoingFlows() {   
    function calculateStream(flowRate) {
      const stream = new BigNumber(flowRate * (86400 * 30)).shiftedBy(-18);
      return stream.toFixed(2);
    }
    function toPositive(n) {
      if (n < 0) {
        n = n * -1;
      }
      return n;
    }
     
  }

  async function createNewFlow(recipient, flowRate, details, displayRate) {
    setIsLoaing(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const SubPackage = Moralis.Object.extend("Subscriber");
    const subPackage = new SubPackage();
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    try {
      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
      });
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: flowRate,
        receiver: recipient,
        superToken: USDCx,
        // userData?: string
      });

      const result = await createFlowOperation.exec(signer);

      let dd;
      if (displayRate.toFixed(2) == details.onemonthPrice) {
        dd = "1 Month";
      } else if (displayRate.toFixed(2) == details.threemonthPrice) {
        dd = "3 Months";
      } else if (displayRate.toFixed(2) == details.sixmonthPrice) {
        dd = "6 Months";
      } else if (displayRate.toFixed(2) == details.twelvemonthPrice) {
        dd = "12 Months";
      } else {
      }
      subPackage.set("subscriptionDuration", dd);
      subPackage.set("subscriptionId", details.objectId);
      subPackage.set("creator", details.username);
      subPackage.set("subscriber", user.attributes.username);
      subPackage.set("subscriberAddress", user.attributes.ethAddress);
      subPackage.set("subscriberAvatar", user.attributes.Avatar);
      subPackage.set("subscriberAllData", user);
      await subPackage.save(); 
      setIsLoaing(false);
      alert(`Congrats - you've just created a money stream!
      View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}`);
      toast.success("Successfully Subscribe!");
      navigate("/dashboard/app");
    } catch (error) {
      toast.error("Something want wrong!");
      setIsLoaing(false);  
      console.error(error);
    }
  }

  async function listOutFlows() { 
     

    function calculateStream(flowRate) {
      const stream = new BigNumber(flowRate * (86400 * 30)).shiftedBy(-18);
      return stream.toFixed(2);
    }
    function toPositive(n) {
      if (n < 0) {
        n = n * -1;
      }
      return n;
    }
    // setTotalStreams(toPositive(calculateStream(flows.flowRate)));
  }

  return (
    <SuperfluidWeb3Context.Provider
      value={{
        getSubAddress,
        outgoingFlows,
        getUSDCXBalance,
        subTotal,
        subflow,
        createNewFlow,
        isLoadingcon,
        listOutFlows,
        totalStreams,
        flow, 
      }}
      {...props}
    >
      {props.children}
    </SuperfluidWeb3Context.Provider>
  );
};
