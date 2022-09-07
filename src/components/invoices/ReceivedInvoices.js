import { Card, CircularProgress, TableBody } from "@mui/material";
import {
  Button,
  Container,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function ReceivedInvoices({ invoices, loading }) {
  const navigate = useNavigate();
  return (
    // <Container pl={0} pr={0}>
      <TableContainer component={Paper} className="mt-4">
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Token</TableCell>
              <TableCell>Note</TableCell>

              <TableCell>Explore</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          )}

            {loading == false && invoices && invoices.length == 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                  <h5>No invoices received yet!</h5>
                </TableCell>
              </TableRow>
            )}

            {loading == false && invoices &&
              invoices.map((invoice) => (
                <TableRow>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.name}</TableCell>
                  <TableCell>{invoice.price}</TableCell>
                  <TableCell>{invoice.token}</TableCell>
                  <TableCell>{invoice.note}</TableCell>
                  <TableCell>
                    <Button
                      //   color="primary"
                      size="large"
                      //   type="submit"
                      variant="contained"
                      to={`/invoice/${invoice.objectId}`}
                      onClick={() => {
                        navigate(`/invoice/${invoice.id}`, {
                          state: invoice,
                        });
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    // </Container>
  );
}

export default ReceivedInvoices;
