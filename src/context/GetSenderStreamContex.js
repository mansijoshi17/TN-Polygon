import React, { useState, createContext } from "react";

import { useMoralis } from "react-moralis"; 
import { ethers } from "ethers"; 
import { useNavigate } from "react-router-dom"; 
export const GetSenderStream = createContext(undefined);

export const url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`;
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
const USDCx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

 
export const GetSenderStreamProvider = (props) => {
  const [isLoadingcon, setIsLoaing] = useState(false);
  const { user } = useMoralis();
  const navigate = useNavigate();
  const [totalStreams, setTotalStreams] = useState(0);
  const [flow, setFlow] = useState();
  const [propsAddress,setPropsAddress]= useState();

  const getPropsAdd=(add)=>{
    setPropsAddress(add);
  }

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();

  // const queryData = networks.map((network) =>
  //   sfSubgraph.useCustomQuery({
  //     chainId: network.chainId,
  //     document: searchByAddressDocument,
  //     variables: {
  //       addressId: propsAddress.toLowerCase(),
  //       addressBytes: propsAddress.toLowerCase(),
  //     },
  //   })
  // );
  // const prefetchStreamsQuery = sfSubgraph.usePrefetch("streams");
  // prefetchStreamsQuery({
  //   chainId: networks[0].chainId,
  //   filter: {
  //     sender: queryData[0].currentData?.accounts[0]?.id,
  //   },
  // });

  // const incomingStreamsQuery = sfSubgraph.useStreamsQuery({
  //   chainId: networks[0].chainId,
  //   filter: {
  //     receiver: queryData[0].currentData?.accounts[0]?.id,
  //   },
  // });

  // const incomingStreamsQuery = sfSubgraph.useStreamsQuery({
  //   chainId: networks[0].chainId,
  //   filter: { 
  //     sender: propsAddress,
  //   },
  // });

  

  async function listOutFlows() {
    // const chainId = await window.ethereum.request({ method: "eth_chainId" });
    // const sf = await Framework.create({
    //   chainId: Number(chainId),
    //   provider: provider,
    // });
    // const flows = await sf.cfaV1.getAccountFlowInfo({
    //   superToken: USDCx,
    //   account: propsAddress,
    //   providerOrSigner: signer,
    // }); 

    // setFlow(
    //   incomingStreamsQuery.data?.data[
    //     incomingStreamsQuery.data?.data.length - 1
    //   ]
    // );

    // function calculateStream(flowRate) {
    //   const stream = new BigNumber(flowRate * (86400 * 30)).shiftedBy(-18);
    //   return stream.toFixed(2);
    // }
    // function toPositive(n) {
    //   if (n < 0) {
    //     n = n * -1;
    //   }
    //   return n;
    // }
    // setTotalStreams(toPositive(calculateStream(flows.flowRate)));
  }

  return (
    <GetSenderStream.Provider
      value={{ 
        isLoadingcon,
        listOutFlows,
        totalStreams,
        getPropsAdd,
        flow, 
      }}
      {...props}
    >
      {props.children}
    </GetSenderStream.Provider>
  );
};
