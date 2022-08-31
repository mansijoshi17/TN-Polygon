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
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { MoneyStreamingContext } from "src/context/CreateMoneyStreamContext";

function GetPaymentDetails() {
  const value = useContext(MoneyStreamingContext);
  const formdata = value.labelInfo.formData;

  const time = ["Year", "Month", "Week"];

  return (
    <div>
      <Stack spacing={3} sx={{ margin: "20px" }}>
        <TextField
          fullWidth
          label="Amount"
          name="amount"
          id="amount"
          type="number"
          onChange={value.setFormdata("amount")}
          value={formdata.amount}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Time</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="period"
            label="Time"
            value={formdata.period}
            onChange={value.setFormdata("period")}
          >
            {time &&
              time.map((t) => {
                return <MenuItem value={t}>{t}</MenuItem>;
              })}
          </Select>
        </FormControl>
        {/* <Grid container>
          <Grid item md={6} xs={6}>
            <label style={{ color: "grey" }}>Start Date :</label>

            <TextField
              fullWidth
              label=" "
              name="sdate"
              id="sdate"
              type="date"
              required
              style={{
                paddingRight: "1vw",
              }}
              value={formdata.sdate}
              onChange={value.setFormdata("sdate")}
            />
          </Grid>
          <Grid item md={6} xs={6}>
            <label style={{ color: "grey" }}>End Date :</label>

            <TextField
              fullWidth
              label=" "
              name="edate"
              id="edate"
              type="date"
              required
              value={formdata.edate}
              onChange={value.setFormdata("edate")}
            />
          </Grid>
        </Grid> */}
      </Stack>
    </div>
  );
}

export default GetPaymentDetails;
