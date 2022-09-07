import { Box, Typography } from "@mui/material";
import React from "react";
import { BsDiscord, BsTwitter } from "react-icons/bs";

export default function LendingFooter() {
  return ( 
    <div className='container-fluid footer' >
      <div className='row'>
        <div className='col'>
          <Box  sx={{ height:  '80px', display:{xs:'block',sm:'flex',md:'flex',lg:'flex'}, justifyContent:'space-around' }}>
            <p className='align-self-center mb-0 '>© Copyright 2022. All Rights Reserved.</p>
            <p className='align-self-center mb-0'> Made with ❤️ for the community</p> 
              <a style={{fontSize:'30px',padding:0,alignSelf:'center'}}  target="_blank" href="https://twitter.com/itsTrustified" ><BsTwitter /></a> 
          </Box>
        </div>
      </div>
    </div>
  );
}
