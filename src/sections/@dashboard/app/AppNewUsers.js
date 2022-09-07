// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';
import { useMoralis } from 'react-moralis';
import React, { useEffect, useState } from 'react';
import { firebaseDataContext } from 'src/context/FirebaseDataContext';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.main
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1352831;

export default function AppNewUsers() {

  const {user}= useMoralis();

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getInvoices, invoices, loading } = firebaseContext;

  const [sentInvoices, setSentInvoices] = useState([]);
  const [receivedInvoices, setReceivedInvoices] = useState([]);

  


  useEffect(() => {
    const s =
    invoices &&
    invoices.filter((s) => s.from == user?.attributes?.ethAddress); 
  setSentInvoices(s);
  const r =
    invoices &&
    invoices.filter(
      (s) => s.to.toLowerCase() == user?.attributes?.ethAddress
    ); 
  setReceivedInvoices(r);
  }, [ ]); 


  useEffect(() => {
    getInvoices();
  }, [ ])
 


  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="ant-design:transaction-outlined" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="body1" color="#000">Send <span style={{fontWeight:900, fontSize:'24px'}}>{sentInvoices.length}</span></Typography>
      <Typography variant="body1" color="#000">Received <span style={{fontWeight:900, fontSize:'24px'}}>{receivedInvoices.length}</span></Typography> 
      <Typography variant="subtitle2" color="#000" sx={{ opacity: 0.72 }}>
         Invoices
      </Typography>
    </RootStyle>
  );
}
