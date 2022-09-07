import { Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const AnimateBalance = ({ value, rate,title, timeout = 100, decimalPlaces = 7 }) => {
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
  return  <Typography variant="body1" color="#000"><span style={{fontWeight:900, fontSize:'16px'}}>{valueShow.toFixed(decimalPlaces)}</span> <span className="text-primary" style={{ fontSize:'14px'}}>{title}</span></Typography> ;
};

export default AnimateBalance;
