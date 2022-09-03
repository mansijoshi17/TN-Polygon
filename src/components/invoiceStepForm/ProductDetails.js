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
    TextField,
    TextareaAutosize,
    Grid,
  } from "@mui/material";
  import React, { useContext, useState, useEffect } from "react";
  import { toast } from "react-toastify";
  import { InvoicContext } from "src/context/CreateInvoiceContext";
  
  function ProductDetails() {
    const value = useContext(InvoicContext);
    const formdata = value.labelInfo.formData;
  
    return (
      <div>
        <Stack spacing={3} sx={{ margin: "20px" }}>
          <Box style={{ marginBottom: "20px" }}>
            <Stack spacing={3}>
              <TextareaAutosize
                fullWidth
                aria-label="minimum height"
                minRows={3}
                placeholder="Description"
                name="description"
                id="description"
                type="text"
                required
                style={{
                  // width: "100%",
                  width: "100%",
                  marginTop: "20px",
                  padding: "10px 10px 0px 10px",
                  borderColor: "#e0e0e0",
                }}
                value={formdata.description}
                onChange={value.setFormdata("description")}
              />
  
              <Grid container>
                <Grid item md={6} xs={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    id="quantity"
                    type="number"
                    required
                    style={{
                      paddingRight: "2vw",
                    }}
                    value={formdata.quantity}
                    onChange={value.setFormdata("quantity")}
                  />
                </Grid>
                <Grid item md={6} xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    id="price"
                    type="number"
                    required
                    value={formdata.price}
                    onChange={value.setFormdata("price")}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={6} xs={6}>
                  <FormControl
                    fullWidth
                    style={{
                      paddingRight: "2vw",
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">Token</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="token"
                      label="Token"
                      value={formdata.token}
                      onChange={value.setFormdata("token")}
                    >
                      <MenuItem value="ETH">ETH</MenuItem>
                      <MenuItem value="MATIC">MATIC</MenuItem>
                      <MenuItem value="AVAX">AVAX</MenuItem>
                      <MenuItem value="BSC">BNB</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Network</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="network"
                      label="Network"
                      value={formdata.network}
                      onChange={value.setFormdata("network")}
                    >
                      <MenuItem value="ethereum">Ethereum</MenuItem>
                      <MenuItem value="polygon">Polygon</MenuItem>
                      <MenuItem value="binance">Bsc</MenuItem>
                      <MenuItem value="avalanche">Avalanche</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </div>
    );
  }
  
  export default ProductDetails;