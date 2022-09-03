import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextareaAutosize,
    TextField,
    Grid,
  } from "@mui/material";
  import React, { useContext, useState, useEffect } from "react";
  import { toast } from "react-toastify";
  import { InvoicContext } from "src/context/CreateInvoiceContext";
  import { firebaseDataContext } from "src/context/FirebaseDataContext";
  
  function CustomerAndTaxDetails() {
    const value = useContext(InvoicContext);
    const formdata = value.labelInfo.formData;
  
    const firebaseContext = React.useContext(firebaseDataContext);
    const { getCustomers, customers } = firebaseContext;
  
    useEffect(async () => {
      getCustomers();
    }, [customers]);
  
    return (
      <div>
        <Stack spacing={3} sx={{ margin: "20px" }}>
          <Box style={{ marginBottom: "20px" }}>
            <Stack spacing={3}>
              <Grid container>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Customer</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="to"
                    label="Customer"
                    value={formdata.to}
                    onChange={value.setFormdata("to")}
                  >
                    {customers &&
                      customers.map((customer) => {
                        return (
                          <MenuItem value={customer.address}>
                            {customer.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <label style={{ marginBottom: "-1vw", color: "grey" }}>
                Tax Details :
              </label>
              <Grid container>
                <Grid item md={6} xs={6}>
                  <TextField
                    fullWidth
                    label="Tax Name"
                    name="taxName"
                    id="taxName"
                    type="text"
                    required
                    style={{
                      paddingRight: "2vw",
                    }}
                    value={formdata.taxName}
                    onChange={value.setFormdata("taxName")}
                  />
                </Grid>
                <Grid item md={6} xs={6}>
                  <TextField
                    fullWidth
                    label="Tax Pescentage"
                    name="taxPercentage"
                    id="taxPercentage"
                    type="number"
                    required
                    value={formdata.taxPercentage}
                    onChange={value.setFormdata("taxPercentage")}
                  />
                </Grid>
              </Grid>
            </Stack>
            <TextareaAutosize
              fullWidth
              aria-label="empty textarea"
              placeholder="Note"
              minRows={3}
              style={{
                // width: "100%",
                width: "100%",
                marginTop: "20px",
                padding: "10px 10px 0px 10px",
                borderColor: "#e0e0e0",
              }}
              value={formdata.note}
              onChange={value.setFormdata("note")}
            />
          </Box>
        </Stack>
      </div>
    );
  }
  
  export default CustomerAndTaxDetails;