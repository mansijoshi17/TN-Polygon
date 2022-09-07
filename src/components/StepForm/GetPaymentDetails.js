import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext } from "react";
import { MoneyStreamingContext } from "src/context/CreateMoneyStreamContext";

function GetPaymentDetails() {
  const value = useContext(MoneyStreamingContext);
  const formdata = value.labelInfo.formData;

  const time = ["Hourly", "Daily", "Weekly", "Monthly", "Yearly", "One Time"];

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
      </Stack>
    </div>
  );
}

export default GetPaymentDetails;
