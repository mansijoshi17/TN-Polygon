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
import React, { useEffect, useState } from "react"; 

import Iconify from "src/components/Iconify"; 
import Page from "../components/Page";
import CreateCustomerModal from "src/modal/CreateCustomer";

import { firebaseDataContext } from "src/context/FirebaseDataContext";
import { shortAddress } from "src/utils/formatNumber"; 
import CopyAddress from "src/utils/Copy";

 

function Customers() { 
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false); 

  const [isUpdated, setIsUpdated] = useState(false);

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getCustomers, customers } = firebaseContext;
 

  useEffect(async () => {
    getCustomers();
  }, [isUpdated]); 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Page title="Customer |  TrustifiedNetwork">
      <CreateCustomerModal
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
            Customers
          </Typography>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Customer
          </Button>
        </Stack>
        <Stack>
          <Card>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Wallet Address</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoaded && (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                  {customers && customers.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                        <h5>No customers are added yet!</h5>
                      </TableCell>
                    </TableRow>
                  )}
                  {customers &&
                    customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell className="d-flex "  >
                          <p className="m-0" style={{ border: '1px solid #eee', padding: '3px 15px', borderRadius: '20px', fontWeight: 'bolder', width: 'fit-content' }}>
                            {shortAddress(customer.address)}
                          </p>
                          <CopyAddress address={customer.address}/>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export default Customers;
