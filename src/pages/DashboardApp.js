// material
import { Box, Grid, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
// components
import Page from "../components/Page";
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate, 
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates,
} from "../sections/@dashboard/app";
import { useNavigate } from "react-router-dom";
import AppTotalAgreement from "src/sections/@dashboard/app/AppTotalAgreement";

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const navigate = useNavigate();
  const { Moralis, user } = useMoralis();

  return (
    <Page title="Dashboard | Trustified">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            Hi, Welcome {user?.attributes.username}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}> 
          <AppTotalAgreement />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid> 
        </Grid>
      </Container>
    </Page>
  );
}
