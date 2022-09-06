import { alpha, Box, List, ListItem, ListItemAvatar, ListItemText, styled, Typography } from '@mui/material'
import React from 'react'
import Iconify from 'src/components/Iconify'


const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.dark,
    backgroundImage: `linear-gradient(135deg,  #fff 0%, #eee 100%)`
}));

function Featurs() {
    return (
        <Box className='container bg-color-feature ' sx={{ marginTop: { xs: "1rem", sm: "2rem", md: '3rem', lg: '4rem' } }}>
            
            <div className="row">
                <div className='col  text-center' >
                    <Typography style={{ margin: '3rem 0' }} variant="h3" sx={{ color: '#fff' }} gutterBottom>
                        Benifits of choosing Trustified
                    </Typography>
                </div>
            </div>

            <div className="row" >
                <div className='col-12 col-sm-6 col-md-4 col-lg-4 ' >
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#5902EC' }}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <IconWrapperStyle>
                                    <Iconify
                                        icon="icon-park-outline:agreement"
                                        width={24}
                                        height={24}
                                    />
                                </IconWrapperStyle>
                            </ListItemAvatar>
                            <ListItemText
                                primary="No hefty commission" 
                                secondary={
                                    <React.Fragment>
                                        {"Send/Receive crypto payments in a reliable."}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                </div>
                <div className='col-12 col-sm-6 col-md-4 col-lg-4' >
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#5902EC' }}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <IconWrapperStyle>
                                    <Iconify
                                        icon="arcticons:crypto-prices"
                                        width={24}
                                        height={24}
                                    />
                                </IconWrapperStyle>
                            </ListItemAvatar>
                            <ListItemText 
                                primary="Risk free noncustodial"
                                secondary={<React.Fragment>
                                    {"Send/Receive crypto payments in a reliable."}
                                </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-4' >
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#5902EC' }}>

                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <IconWrapperStyle>
                                    <Iconify
                                        icon="fa6-solid:file-invoice-dollar"
                                        width={24}
                                        height={24}
                                    />
                                </IconWrapperStyle>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Instant settlement."
                                secondary={
                                    <React.Fragment>
                                        {"Send / Recieve invoices to your customers."}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                </div>
            </div>
        </Box>
    )
}

export default Featurs