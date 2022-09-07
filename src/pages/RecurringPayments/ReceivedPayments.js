import { Button, Card, TableBody } from "@mui/material";
import {
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
import React, { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";

import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../../components/Page";
import { FlowingStream } from "../../components/FlowingStream";

import { SuperfluidContext } from "../../context/SuperFluideContext";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
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

function ReceivedPayments() { 

  const firebaseContext = React.useContext(firebaseDataContext);
  const { payments } = firebaseContext;

  const superfluidContext = React.useContext(SuperfluidContext);
  const { listInFlows, sf, isUpdatedctx, inFlows ,isLoaded} = superfluidContext;

  useEffect( () => {
    getData();
  }, [sf, isUpdatedctx]);

  async function getData(){
    if (sf) { 
    await  listInFlows();
    }
  }

  return (
    <Page title="Recurring Payment |  Trustified">
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
            // onClick={handleClickOpen}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Request Payment
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
                  {isLoaded == false && inFlows && inFlows.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        <h5>No payments received yet!</h5>
                      </TableCell>
                    </TableRow>
                  )}

                  {isLoaded == false && inFlows &&
                    inFlows.map((flow) => { 
                      return (
                        <TableRow key={flow.id}>
                          <TableCell className="d-flex ">
                            <p
                              className="m-0"
                              style={{
                                border: "1px solid #eee",
                                padding: "3px 15px",
                                borderRadius: "20px",
                                fontWeight: "bolder",
                                width: "fit-content",
                              }}
                            >
                              {shortAddress(flow.sender)}
                            </p>
                            <CopyAddress address={flow.sender} />
                          </TableCell>
                          <TableCell>
                            <FlowingStream streamData={flow} />
                          </TableCell>
                          <TableCell>
                            {flow.amount}/{flow.period}
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
