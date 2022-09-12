import { Box, Typography } from "@mui/material";
import React from "react";
import { BsDiscord, BsTwitter } from "react-icons/bs";

export default function LendingFooter() {
  return (
    <div className='container-fluid footer' >
      <div className='row'>
        <div className='col'>
          <Box 
            style={{
              position: 'relative',
              height: '80px',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <p className='align-self-center mb-0 text-center' 
              style={{
                display: 'flex',
                margin: '1px',
                padding: '5px'
              }}
            > Made with ❤️ for the community</p>
            <a style={{
              fontSize: '30px',
              position: 'absolute',
              top: '15px',
              right: 0,
            }} target="_blank" href="https://twitter.com/itsTrustified" ><BsTwitter /></a>
          </Box>
        </div>
      </div>
    </div>
  );
}
