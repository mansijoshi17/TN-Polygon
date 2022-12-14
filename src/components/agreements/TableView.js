import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableViewBody from "./TableViewBody";
import { ethers } from "ethers";
import CircularProgress from "@mui/material/CircularProgress";
import { AgreementContractAbi } from "../../contracts/config";
import { AgreementAddress, AgreementBscAddress, AgreementMumbaiAddress, AgreementRopestenAddress,AgreementAvaxAddress } from "../../contracts/contract";

function TableView(props) {
  const [contractAddressList, setContractAddressList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get data for all the user's contracts
  const getAllContracts = useCallback(
    async (account) => {
      setIsLoading(true);
      const networkId = window.ethereum.networkVersion;

      let contractAddresss;
      if (networkId == 97) {
        contractAddresss = AgreementBscAddress;
      } else if (networkId == 80001) {
        contractAddresss = AgreementMumbaiAddress;
      } else if (networkId == 3) {
        contractAddresss = AgreementRopestenAddress;
      } else if (networkId == 28) {
        contractAddresss = AgreementAddress;
      }  else if (networkId == 43113) {
        contractAddresss = AgreementAvaxAddress;
      }


      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const agreementContract = new ethers.Contract(
        contractAddresss,
        AgreementContractAbi,
        signer
      );
      let agreAddress = await agreementContract.getAgreementByParties(
        account
      );

      setContractAddressList(agreAddress.slice().reverse());

      // Set up event listener for factory contract
      agreementContract.on("CreateAgreement", (buyer, seller, price, address, title, description) => {
        if (
          props.currentAccount.toLowerCase() === buyer.toLowerCase() ||
          props.currentAccount.toLowerCase() === seller.toLowerCase()
        ) {
          setContractAddressList((prevState) => {
            if (!prevState.includes(address)) return [address, ...prevState];
            return prevState;
          });
        }
      });
      setIsLoading(false);
    },
    [props.currentAccount]
  );

  // Load contract data when component loads
  useEffect(() => {
    getAllContracts(props.currentAccount);
  }, [props.currentAccount, getAllContracts]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="center"># </TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Buyer</TableCell>
            <TableCell>Seller</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Explore</TableCell>
          </TableRow>
        </TableHead>
        {isLoading && (
           <TableBody>
          <TableRow>
            <TableCell colSpan={6} sx={{ textAlign: "center" }}>
              <CircularProgress />
            </TableCell>
          </TableRow>
          </TableBody>
        )}
        {contractAddressList && contractAddressList.length == 0 && (
          <TableBody>
          <TableRow>
            <TableCell colSpan={6} sx={{ textAlign: "center" }}>
              <h5>No contract available</h5>
            </TableCell>
          </TableRow>
          </TableBody>
        )}

        {/* <TableBody> */}
        {contractAddressList &&
          contractAddressList.map((list) => { 
            return (
              <TableViewBody
                key={list}
                contractAddress={list}
                currentAccount={props.currentAccount}
              />
            );
          })}

        {/* </TableBody> */}
      </Table>
    </TableContainer>
  );
}

export default TableView;