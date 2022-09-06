import { alpha, Button, Card, styled, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import { Web3ModalContext } from 'src/context/Web3Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Iconify from 'src/components/Iconify';
import Slider from './Slider';
import { Box } from '@mui/system';
import Featurs from './featurs';

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
    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
        theme.palette.primary.dark,
        0.24
    )} 100%)`
}));

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: "0 10px 20px rgb(0 0 0 / 20%)",
    border: "none",
    textAlign: "center",
    padding: theme.spacing(5, 5),
    color: theme.palette.primary.main,
}));


function Home() {

    const web3ModalContext = React.useContext(Web3ModalContext);
    const { connectWallet, account } = web3ModalContext;
    return (
        <Fragment>
            <Box className="container" sx={{ marginTop: { xs: "1rem", sm: "2rem", md: '3rem', lg: '4rem' } }}>
                <div className="row colum-reverse justify-content-between" >
                    <div className='col-12   col-md-6 col-lg-6 ' >
                        <Box sx={{ marginTop: { xs: "30px", sm: "40px", md: '60px', lg: '110px' } }}>
                            <Typography variant="h2" sx={{ color: '#25353D' }} gutterBottom>
                                Noncustodial, Multichain crypto payments.
                            </Typography>
                            <Typography variant='body1' sx={{ color: '#8C9498', fontSize: '1.2rem' }} gutterBottom>
                                Simple crypto payment solution enabling DAOs, Freelancers, and Businesses in the crypto industry to accept crypto payments globally without paying hefty commissions.
                            </Typography>
                            <Button
                                className="text-center my-2"
                                variant="contained"
                                style={{ padding: '10px 20px' }}
                                onClick={async () => {
                                    try {
                                        await connectWallet();
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </div>
                    <div className='col-12   col-md-6 col-lg-6'>
                        <Slider />
                    </div>
                </div>

            </Box>
            <Featurs />
            <Box className="container" sx={{ marginTop: { xs: "1rem", sm: "2rem", md: '3rem', lg: '4rem' } }}>
                <div className="row"  >
                    <div className='col  text-center' >
                        <Typography variant="h3" sx={{ color: '#25353D' }} gutterBottom>
                            Builds For
                        </Typography>
                    </div>
                </div>
            </Box>

            <Box className="container" sx={{ marginTop: { xs: "1rem", sm: "2rem", md: '3rem', lg: '3rem' } }}>
                <div className="row"  >
                    <div className="col-12 col-lg-4 col-md-4 mt-3">
                        <RootStyle style={{ height: "100%" }}>
                            <IconWrapperStyle>
                                <Iconify
                                    icon="fluent:inprivate-account-20-filled"
                                    width={24}
                                    height={24}
                                />
                            </IconWrapperStyle>
                            <Typography variant="h4" color="#25353D">
                                Individuals
                            </Typography>
                            <Typography
                                variant="body1"
                                color="#8C9498"
                                sx={{ opacity: 0.72 }}
                            >
                               Trustified makes it easy for Individual contractors and freelancers to track and get paid in Crypto.
                            </Typography>
                        </RootStyle>
                    </div>

                    <div className="col-12 col-lg-4 col-md-4 mt-3 ">
                        <RootStyle style={{ height: "100%" }}>
                            <IconWrapperStyle>
                                <Iconify
                                    icon="ic:baseline-business-center"
                                    width={24}
                                    height={24}
                                />
                            </IconWrapperStyle>
                            <Typography variant="h4" color="#25353D">
                                Businesses
                            </Typography>
                            <Typography
                                variant="body1"
                                color="#8C9498"
                                sx={{ opacity: 0.72 }}
                            >
                               Now any business can set up recurring payments for their vendors, salaries and manage them easily using Trustified.
                            </Typography>
                        </RootStyle>
                    </div>
                    <div className="col-12 col-lg-4 col-md-4 mt-3">
                        <RootStyle style={{ height: "100%" }}>
                            <IconWrapperStyle>
                                <Iconify
                                    icon="fluent:people-community-16-filled"
                                    width={24}
                                    height={24}
                                />
                            </IconWrapperStyle>
                            <Typography variant="h4" color="#25353D">
                                DAOs
                            </Typography>
                            <Typography
                                variant="body1"
                                color="#8C9498"
                                sx={{ opacity: 0.72 }}
                            >
                               At Trustified, DAOs can make payments to their contributors, and track and share the overall activity with the community members.  
                            </Typography>
                        </RootStyle>
                    </div>
                </div>
            </Box>

            <Box className="container" sx={{ margin: { xs: "1rem 0", sm: "2rem 0", md: '3rem 0', lg: '4rem 0' } }}>
                <div className="row colum-reverse justify-content-between"   >
                <div className='col-12 col-sm-6  col-md-6 col-lg-6 mt-5 row-width' >
                <Box sx={{ marginTop: { xs: "30px", sm: "40px", md: '60px', lg: '110px' } }}>
                            <Typography variant="h2" sx={{ color: '#25353D' }} gutterBottom>
                              FIAT on Ramp
                            </Typography>
                            <Typography variant='body1' sx={{ color: '#8C9498', fontSize: '1.2rem' }} gutterBottom>
                                Built in integrations for FIAT on Ramp to make your crypto onboarding journey super easy.
                            </Typography>
                        </Box>
                    </div>
                    <div className='col-12 col-sm-6  col-md-6 col-lg-6 p-2' >
                        <RootStyle>
                            <img src='/images/transak.png' alt='bg' width="100%" height="auto" />
                        </RootStyle>

                    </div> 
                </div>
            </Box>
        </Fragment>
    )
}

export default Home