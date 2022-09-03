import React, { useState } from "react";
import PropTypes from "prop-types";
// material
import { alpha, styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar, IconButton, Button } from "@mui/material";
// components
import Iconify from "../../components/Iconify"; 
import AccountPopover from "./AccountPopover"; 
import NotificationsPopover from "./NotificationsPopover";
import { useMoralis } from "react-moralis"; 
 
import { TransakWeb3Context } from "../../context/Transak";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.paper, 1),
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const {authenticate, user  } =
    useMoralis(); 

  const TransakWeb3context = React.useContext(TransakWeb3Context);
  const { openTransak } = TransakWeb3context;
 

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: "text.primary", display: { lg: "none" } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton> 
        <Box sx={{ flexGrow: 1 }} /> 
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        > 
          <Button onClick={() => openTransak()}>Fiat On-Ramp</Button>

          <NotificationsPopover></NotificationsPopover>

          <AccountPopover />

          {user == null ? (
            <Button onClick={() => authenticate()}>Connect</Button>
          ) : (
            <p style={{ color: "black", textOverflow: "ellipsis" }}>
              {user && user?.attributes?.username}
            </p>
          )} 
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
