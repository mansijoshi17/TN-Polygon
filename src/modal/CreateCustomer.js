import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as Yup from 'yup'; 
import { Stack, TextField, Box, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab"; 
import { toast } from "react-toastify"; 
import { collection, addDoc, db } from "../firebase"; 
 
function CreateCustomerModal(props) { 
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string('Enter email').email('Enter a valid email').required('Email is required'),
    name: Yup.string('Enter Name').required('Name is required'),
    address: Yup.string('Enter customer Address').required('Address is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async(values, { resetForm }) => {
      setLoading(true); 
      try {
        const docRef = await addDoc(collection(db, "customers"), {
          name: values.name,
          address: values.address,
          email: values.email,
          admin: localStorage.getItem("user"),
        });
        props.setIsUpdated(!props.isUpdated);
        resetForm();
        setLoading(false);
        props.close();
        toast.success("Successfully customer created!!");
      } catch (error) {
        console.log(error);
        setLoading(false); 
        toast.error("Something went wrong!");
      }
    },
  });


 

  return (
    <div>
      <Dialog open={props.op} onClose={props.close} fullWidth>
        <DialogTitle
          style={{
            textAlign: "center",
          }}
        >
          Create Customer
        </DialogTitle>
        <DialogContent style={{ overflowX: "hidden" }}>
          <div>
            <Box style={{ marginBottom: "20px" }}></Box>
            <form
              onSubmit={formik.handleSubmit}
              style={{
                justifyContent: "center",
                marginLeft: "auto",
                marginRight: "auto",
                // marginTop: "100px",
              }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  id="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />  
                <TextField
                  fullWidth
                  label="Wallet Address"
                  name="address"
                  id="address"
                  type="text"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  id="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}

                />
              </Stack>

              <DialogActions>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={formik.isSubmitting}
                  disabled={loading}
                >
                  {loading ?  <CircularProgress/> : "Create"}
                </LoadingButton>
                <Button onClick={props.close} variant="contained">
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CreateCustomerModal;
