import { Card, TableBody, Tooltip } from "@mui/material";
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
  TextField,
  CircularProgress,
} from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "src/components/Iconify";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { LoadingButton } from "@mui/lab";

import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../../components/Page";
import CreateRecurringPayments from "src/modal/CreateRecurringPayments"; 
import { FlowingStream } from "../../components/FlowingStream";

import { firebaseDataContext } from "../../context/FirebaseDataContext";

import { SuperfluidContext } from "../../context/SuperFluideContext"; 
import { shortAddress } from "src/utils/formatNumber"; 
import CopyAddress from "src/utils/Copy";

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


const superTokens={
  MATICx: "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4",
  fDAIx: "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f",
  fUSDC: "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2",
};
 

function SentPayments() {
  const [status, setStatus] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false); 
  const [value, setValue] = React.useState(0);
  const [amountVal, setAmountVal] = useState(0);
  const [flow, setFlow] = useState({});

  const [openUpdate, setOpenUpdate] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false); 

  const firebaseContext = React.useContext(firebaseDataContext);
  const {getPayments, payments } = firebaseContext;

  const superfluidContext = React.useContext(SuperfluidContext);
  const { listOutFlows, sf, isUpdatedctx, outFlows, deleteFlow, updateStream ,isLoaded} =
    superfluidContext;
 
 
  useEffect( () => {
    getData();
  }, [sf, isUpdatedctx, payments.length]);

  async function getData(){
    if (sf) { 
      await getPayments();
      await  listOutFlows();
    }
  };
  

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
  return (
    <Page title="Recurring Payment |  Trustified">
      <CreateRecurringPayments
        open={handleClickOpen}
        close={handleClose}
        op={open}
        setIsUpdated={setIsUpdated}
        isUpdated={isUpdated}
      />
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
          <Button
            variant="contained"
            onClick={handleClickOpen}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Send Payment
          </Button>
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoaded && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableBody>
                  {isLoaded == false && outFlows && outFlows.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                        <h5>No payments sent yet!</h5>
                      </TableCell>
                    </TableRow>
                  )}
                  {isLoaded == false && outFlows &&
                    outFlows.map((flow) => {
                      return (
                        <TableRow key={flow.id}>
                           <TableCell className="d-flex "  >
                          <p className="m-0" style={{ border: '1px solid #eee', padding: '3px 15px', borderRadius: '20px', fontWeight: 'bolder', width: 'fit-content' }}>
                            {shortAddress(flow.receiver)}
                          </p>
                          <CopyAddress address={flow.receiver}/>
                        </TableCell>  
                          <TableCell>
                            {flow.period == "One Time" ? <span>{flow.amount} {" "} <span className="text-primary">{superTokens.fDAIx == flow.token && "fDAIx" || superTokens.MATICx == flow.token && "MATICx" || superTokens.fUSDC == flow.token && "fUSDC" }</span> </span> : (
                              <FlowingStream streamData={flow} />
                            )}
                          </TableCell>
                          <TableCell>
                            {flow.amount}/{flow.period}
                          </TableCell>
                          <TableCell className="d-flex">
                            {flow.period == "One Time" ? (
                              <>
                              <div
                                style={{
                                  cursor: "pointer",
                                  margin: "0 10px",
                                }} 
                              >
                                {getIcon("uil:edit")}
                              </div>
                              <div
                                style={{
                                  cursor: "pointer",
                                  margin: "0 10px",
                                }} 
                              >
                                {getIcon("uil:trash")}
                              </div>
                            </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    cursor: "pointer",
                                    margin: "0 10px",
                                  }}
                                  onClick={() => {
                                    setOpenUpdate(true);
                                    setAmountVal(flow.amount);
                                    setFlow(flow);
                                  }}
                                >
                                  {getIcon("uil:edit")}
                                </div>
                                <div
                                  style={{
                                    cursor: "pointer",
                                    margin: "0 10px",
                                  }}
                                  onClick={() => deleteFlow(flow)}
                                >
                                  {getIcon("uil:trash")}
                                </div>
                              </>
                            )}
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
      <Dialog open={openUpdate} close={() => setOpenUpdate(false)} fullWidth>
        <DialogTitle
          style={{
            textAlign: "center",
          }}
        >
          Update stream
        </DialogTitle>
        <DialogContent style={{ overflowX: "hidden" }}>
          <div>
            <Box style={{ marginBottom: "20px" }}></Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                id="amount"
                type="number"
                value={amountVal}
                onChange={(e) => setAmountVal(e.target.value)}
              />
            </Stack>

            <DialogActions>
              <LoadingButton
                type="submit"
                variant="contained"
                onClick={async () => {
                  setLoading(true);
                  await updateStream(flow, amountVal);
                  setLoading(false);
                  setOpenUpdate(false);
                }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </LoadingButton>
              <Button variant="contained" onClick={() => setOpenUpdate(false)}>
                Cancel
              </Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
    </Page>
  );
}

export default SentPayments;
