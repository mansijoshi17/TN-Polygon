// material
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";
// component
import Iconify from "../../../components/Iconify";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { useEffect, useState } from "react";
import { AgreementAddress } from "../../../contracts/config";
import { AgreementAvaxAddress, AgreementBscAddress, AgreementContractAbi, AgreementMumbaiAddress, AgreementRopestenAddress } from "src/contracts/contract";
import { ethers } from "ethers";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.main,
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0
  )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function AppTotalAgreement() {
  const { Moralis, user } = useMoralis(); 
  const [contractAddressList, setContractAddressList] = useState(null); 
 
  useEffect(async () => { 
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
        user?.attributes?.ethAddress
      );

      setContractAddressList(agreAddress.slice().reverse());

  
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
    
  }, []); 

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="icon-park-outline:agreement" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3" color="#000">
        { contractAddressList === null ? 0 : contractAddressList.length}
      </Typography>
      <Typography variant="subtitle2" color="#000" sx={{ opacity: 0.72 }}>
        Escrow Agreements
      </Typography>
    </RootStyle>
  );
}