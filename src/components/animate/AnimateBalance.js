import { Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const AnimateBalance = ({ value, rate, timeout = 100, decimalPlaces = 7 }) => {
  const [valueShow, setValueShow] = useState(value);
  useEffect(() => {
    setValueShow(value);
    const id = setInterval(() => {
      setValueShow((currValue) => {
        return currValue + rate / (1000 / timeout);
      });
    }, timeout);
    return () => {
      clearInterval(id);
    };
  }, [value, rate]);
  return  <Typography variant="h3" color="#000">{valueShow.toFixed(decimalPlaces)}</Typography> ;
};

export default AnimateBalance;
