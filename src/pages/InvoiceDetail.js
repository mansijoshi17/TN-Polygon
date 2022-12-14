import React, { createRef, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import Link from "@mui/material/Link";
import pic from "./invoice.png";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { toast } from "react-toastify";

import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useMoralisCloudFunction } from "react-moralis";

import { collection, addDoc, getDocs, db, updateDoc, doc } from "../firebase";

// import PDFButton from "./PDFButton";

export default function InvoiceDetail() {
  const { user, Moralis, account } = useMoralis();
  const params = useParams();
  let docToPrint = React.createRef();
  const [gst, setGst] = useState(0);
  const [invoice, setInvoice] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    const invoices = collection(db, "invoices");
    const invoiceSnapshot = await getDocs(invoices);
    invoiceSnapshot.docs.map((doc) => {
      if (doc.id == params.id) {
        setInvoice(doc.data());
      }
    });
  }, [params.id]);

  async function updateInvoice() {
    const invoiceRef = doc(db, "invoices", params.id.toString());

    await updateDoc(invoiceRef, {
      paid: true,
    });
  }

  async function storeFiles() {
    const input = docToPrint.current;
    // const token = process.env.API_TOKEN;
    // const client = new Web3Storage({ token });
    //
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [900, 600],
      });
      // uploadBook(pdf);

      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("Invoice_Detail.pdf");
    });
  }

  const handlePayNow = async (invc) => {
    setLoading(true);
    const amt = invc && invc.price * invc.quantity + gst;

    const address = invc?.to;
    await Moralis.enableWeb3();
    const options = {
      type: "native",
      amount: Moralis.Units.ETH(amt, "18"),
      receiver: address,
      contractAddress: "0x0000000000000000000000000000000000001010",
    };
    let result = await Moralis.transfer(options);
    if (result) {
      updateInvoice();
    }
    setLoading(false);
    toast.success("Payment success!");
  };

  useEffect(() => {
    invoice &&
      setGst((invoice.price * invoice.quantity * invoice.taxPercentage) / 100);
  }, [invoice]);

  return (
    <div className="mt-5 mb-5">
      <div
        className="mt-5"
        ref={docToPrint}
        style={{
          borderRadius: "5px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div className="container" id="invoiceDetail">
          <div className="container">
            <div className="panel panel-default mb-5">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-sm-8">
                    <strong>INVOICE No: {invoice?.invoiceNumber}</strong>
                    <br />
                    Invoice by: {user?.attributes.username}
                  </div>
                  {invoice && (
                    <div className="col-sm-4">
                      {" "}
                      Created:{" "}
                      {new Date(invoice?.created?.seconds * 1000).getDate() +
                        "-" +
                        parseInt(
                          new Date(
                            invoice?.created?.seconds * 1000
                          ).getMonth() + 1
                        ) +
                        "-" +
                        new Date(
                          invoice?.created?.seconds * 1000
                        ).getFullYear()}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-sm-8"> </div>
                  <div className="col-sm-4"></div>
                </div>
                <div className="row"></div>
              </div>
              <div className="panel-body">
                <div className="col-md-6 mb-3">
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <address>
                        <strong>Customer Details: </strong>
                        <br />
                        <strong>Name: </strong>
                        {invoice?.name}
                        <br />
                        <strong>Wallet: </strong>
                        {invoice?.to}
                      </address>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3 text-right">
                  <div className="panel panel-default"></div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>No. </th>
                      <th>Product/Service Description </th>
                      <th>Qty. </th>
                      <th>Price </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 </td>
                      <td>{invoice?.description}</td>
                      <td>{invoice?.quantity}</td>
                      <td>{invoice?.price}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="row justify-content-end">
                  <div className="col-md-7">
                    Tax Name: {invoice?.taxName}
                    <br />
                    Tax Percentage: {invoice?.taxPercentage}%
                    <br />
                  </div>
                  <div className="col-md-5">
                    <table className="table borderless">
                      <tbody>
                        <tr>
                          <th
                            scope="row"
                            //   className="text-right"
                            //   style={{ paddingRight: "4vw" }}
                          >
                            Subtotal
                          </th>
                          <th
                            className="text-right"
                            style={{ paddingRight: "2vw" }}
                          >
                            {invoice?.price * invoice?.quantity}
                          </th>
                        </tr>
                        <tr>
                          <th scope="row" className="text-right">
                            GST {invoice?.taxPercentage}%
                          </th>
                          <th className="text-right">{gst}</th>
                        </tr>
                        <tr>
                          <th scope="row" className="text-right">
                            TOTAL
                          </th>
                          <th className="text-right">
                            {invoice && invoice.price * invoice.quantity + gst}
                            &nbsp;{invoice?.token} Preferred Network:{" "}
                            {invoice?.network}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="panel-footer" style={{ height: "10rem" }}>
                <div className="col-md-6 col-md-offset-3">
                  <div className="col-md-6">Client Signature :</div>
                </div>
                {/* {user?.attributes.ethAddress == invoice?.to.toLowerCase() ? (
                  <div className="paynowLink">
                    <Button
                      style={{
                        color: "blue",
                        fontSize: "0.875rem",
                        float: "right",
                        padding: "5px 15px",
                        border: "blue 1px solid",
                      }}
                      onClick={() => handlePayNow(invoice)}
                    >
                      Pay Now
                    </Button>
                  </div>
                ) : (
                  ""
                )} */}

                {invoice?.paid ? (
                  <Button
                    style={{
                      color: "blue",
                      fontSize: "0.875rem",
                      float: "right",
                      padding: "5px 15px",
                      border: "blue 1px solid",
                    }}
                    disabled
                  >
                    Paid
                  </Button>
                ) : user?.attributes.ethAddress == invoice?.to.toLowerCase() ? (
                  <div className="paynowLink">
                    <Button
                      style={{
                        color: "blue",
                        fontSize: "0.875rem",
                        float: "right",
                        padding: "5px 15px",
                        border: "blue 1px solid",
                      }}
                      onClick={() => handlePayNow(invoice)}
                      disabled={loading}
                    >
                      {loading ? "Paying..." : "Pay Now"}
                    </Button>
                  </div>
                ) : (
                  ""
                )}

                <div className="downloadbtn" style={{ marginTop: "25px" }}>
                  <Button variant="outlined" onClick={() => storeFiles()}>
                    Download PDF !
                  </Button>
                </div>

                <div className="mb-5">
                  <div style={{ textAlign: "center" }}>
                    <h5>Powered By</h5>
                  </div>
                  <div
                    className="invoiceImg"
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginBottom: "30px",
                    }}
                  >
                    <img src={"/images/trustified.png"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}