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
} from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "src/components/Iconify";
import { Web3Context } from "src/context/Web3Context";
import { factoryAbi, factoryAddress } from "src/contracts/contract";
import CreateInvoiceModal from "src/modal/CreateInvoiceModal";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { firebaseDataContext } from "src/context/FirebaseDataContext";
import { InvoicContext } from "src/context/CreateInvoiceContext";

import SentInvoices from "../components/invoices/SentInvoices";
import ReceivedInvoices from "../components/invoices/ReceivedInvoices";

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

function Invoices() {
  const { user } = useMoralis();
  const navigate = useNavigate();
  const web3Context = React.useContext(Web3Context);
  const { address } = web3Context;

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getInvoices, invoices } = firebaseContext;
  const [sentInvoices, setSentInvoices] = useState([]);
  const [receivedInvoices, setReceivedInvoices] = useState([]);

  const invoiceContext = React.useContext(InvoicContext);
  const { updated } = invoiceContext;

  useEffect(async () => {
    const s =
      invoices &&
      invoices.filter((s) => s.from == user?.attributes?.ethAddress);
    setSentInvoices(s);
    const r =
      invoices &&
      invoices.filter(
        (s) => s.to.toLowerCase() == user?.attributes?.ethAddress
      );
    setReceivedInvoices(r);
  }, [invoices, isUpdated]);

  const [status, setStatus] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(async () => {
    getInvoices();
  }, [updated, isUpdated]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="Invoice |  TrustifiedNetwork">
      <CreateInvoiceModal
        open={handleClickOpen}
        close={handleClose}
        op={open}
        acc={address}
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
            Invoices
          </Typography>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Invoice
          </Button>
        </Stack>
        <Stack>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Sent" {...a11yProps(0)} />
                <Tab label="Received" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <SentInvoices invoices={sentInvoices} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ReceivedInvoices invoices={receivedInvoices} />
            </TabPanel>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export default Invoices;
