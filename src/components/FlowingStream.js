import React, { FC, ReactElement, useEffect, useState } from "react";
import { ethers } from "ethers";

const ANIMATION_MINIMUM_STEP_TIME = 100;

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

  return <span>{formattedValue}</span>;
};
