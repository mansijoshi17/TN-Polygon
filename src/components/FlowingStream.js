import React, { FC, ReactElement, useEffect, useState } from "react";
import { ethers } from "ethers";

const ANIMATION_MINIMUM_STEP_TIME = 10;

export const FlowingStream = ({ updatedAt, timestamp, currentFlowRate }) => {
  const [formattedValue, setFormattedValue] = useState(0.00);

  useEffect(() => { 
    const id = setInterval(() => {
      const date = new Date();
      const currentTime = Math.floor(date.getTime() / 1000);
      let val = updatedAt + (currentTime - timestamp) * currentFlowRate; 
      setFormattedValue(val);
    }, ANIMATION_MINIMUM_STEP_TIME);

    return () => {
      clearInterval(id);
    };
  }, [updatedAt, timestamp, currentFlowRate]);


  return <span>{formattedValue.toFixed(14)}</span>;
};
