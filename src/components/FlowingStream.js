import React, { FC, ReactElement, useEffect, useState } from "react";
import { ethers } from "ethers";

const ANIMATION_MINIMUM_STEP_TIME = 100;

const superTokens={
  MATICx: "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4",
  fDAIx: "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f",
  fUSDC: "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2",
};

export const FlowingStream = ({ streamData }) => {
  const [formattedValue, setFormattedValue] = useState("0.00");

  function loadTimeFlow() {
    setInterval(() => {
      const date = new Date();
      const currentTime = Math.floor(date.getTime() / 1000);
      let val =
        parseFloat(streamData?.streamedUntilUpdatedAt) +
        (currentTime - parseFloat(streamData?.updatedAtTimestamp)) *
          parseFloat(streamData?.currentFlowRate);
      setFormattedValue((val / 1e18).toFixed(10));
    }, 100);
  }

  useEffect(() => {
    loadTimeFlow();

    return () => {
      clearInterval(loadTimeFlow());
    };
  }); 

  return <span>{formattedValue} {" "} <span className="text-primary">{superTokens.fDAIx == streamData.token && "fDAIx" || superTokens.MATICx == streamData.token && "MATICx" || superTokens.fUSDC == streamData.token && "fUSDC" }</span> </span>;
};
