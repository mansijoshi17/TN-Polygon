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
        parseInt(streamData?.streamedUntilUpdatedAt) +
        (currentTime - parseInt(streamData?.updatedAtTimestamp)) *
          parseInt(streamData?.currentFlowRate);
      setFormattedValue(val);
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
