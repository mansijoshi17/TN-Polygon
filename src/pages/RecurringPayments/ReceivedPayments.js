import { Card, TableBody } from "@mui/material";
import {
  Button,
  Container,
  Stack,
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "src/components/Iconify";

import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../../components/Page";
import CreateRecurringPayments from "src/modal/CreateRecurringPayments";
import { collection, addDoc, getDocs, db } from "../../firebase";
import { FlowingStream } from "../../components/FlowingStream";

import { SuperfluidContext } from "../../context/SuperFluideContext";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import AnimatedBalance from "src/superfluid/AnimateBalance";
import { shortAddress } from "src/utils/formatNumber";
import Decimal from "decimal.js";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

function ReceivedPayments() {
  const [status, setStatus] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getPayments, payments } = firebaseContext;

  const superfluidContext = React.useContext(SuperfluidContext);
  const { listInFlows, sf, isUpdatedctx, inFlows } = superfluidContext;

  useEffect(async () => {
    if (sf) {
      await getPayments();
      listInFlows();
    }
  }, [sf, isUpdatedctx]);

  console.log(inFlows, "inFlows");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


  // export const streamGranularityInSeconds = {
  //   second: 1,
  //   minute: 60,
  //   hour: 3600,
  //   day: 86400,
  //   week: 86400 * 7,
  //   month: 86400 * 30
  // } 

  return (
    <Page title="Recurring Payment |  TrustifiedNetwork">
      <Container pl={0} pr={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Payments
          </Typography>
        </Stack>
        <Stack>
          <Card>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>All Time Flow</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoaded && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableBody>
                  {inFlows && inFlows.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        <h5>No payments received yet!</h5>
                      </TableCell>
                    </TableRow>
                  )}

                  {inFlows &&
                    inFlows.map((flow) => {
                      var updatedAt = parseFloat(flow.streamedUntilUpdatedAt);
                      var timestamp = parseFloat(flow.updatedAtTimestamp);
                      var currentFlowRate = parseFloat(ethers.utils.formatEther(flow.currentFlowRate));
                      console.log(flow.currentFlowRate, "flow.currentFlowRate");
                      // var flowrate = (flow.currentFlowRate * 3600 * 24 * 30) / 1e18;
                      const flowRateBigNumber = BigNumber.from(flow.currentFlowRate);
                      // let time;
                      // if (flow.period == "Week") {
                      //   time = 86400 * 7;
                      // } else if (flow.period == "Month") {
                      //   time = 86400 * 30;
                      // } else if (flow.period == "Day") {
                      //   time = 86400;
                      // } else if (flow.period == "Hour") {
                      //   time = 3600;
                      // }
                      const flowRateConverted = flowRateBigNumber.mul(86400).toString();
                      const ether = ethers.utils.formatEther(flowRateConverted);
                      const isRounded = ether.split(".")[1].length > 18;
                      return (
                        <TableRow>
                          <TableCell>{shortAddress(flow.sender)}</TableCell>
                          <TableCell>
                            <FlowingStream updatedAt={updatedAt} timestamp={timestamp} currentFlowRate={currentFlowRate} streamData={flow} />
                          </TableCell>
                          <TableCell>
                            {isRounded && "~"}{new Decimal(ether).toDP(18).toFixed()} / Day 
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export default ReceivedPayments;
