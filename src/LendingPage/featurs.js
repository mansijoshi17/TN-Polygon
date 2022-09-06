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
    color: theme.palette.primary.dark,
    backgroundImage: `linear-gradient(135deg,  #fff 0%, #eee 100%)`
}));

const featureList = [
    {
        title: "No hefty commission",
        icon: "/images/icon2.png",
    },
    {
        title: "Risk free noncustodial",
        icon: "/images/icon1.png",
    },
    {
        title: "Instant settlement",
        icon: "/images/icon3.png",
    },
    {
        title: "Chain Agnostic",
        icon: "/images/icon4.png",
    },
    {
        title: "Realtime money streaming",
        icon: "/images/icon5.png",
    },
    {
        title: "Recurring payment",
        icon: "/images/icon6.png",
    },
]

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
                {
                    featureList.map((e) => {
                        return (
                            <FeaturList title={e.title} icon={e.icon} key={e.title} />
                        )
                    })
                }
            </div>
        </Box>
    )
}

export default Featurs

export const FeaturList = (props) => {
    return (
        <div className='col-12 col-sm-6 col-md-4 col-lg-4' >
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#5902EC' }}>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <IconWrapperStyle>
                            {/* <Iconify 
                                icon={props.icon}
                                width={24}
                                height={24}
                            /> */}
                            <img
                                src={props.icon}
                                width={24}
                                height={24}
                                alt=""/>
                        </IconWrapperStyle>
                    </ListItemAvatar>
                    <ListItemText
                        primary={props.title}
                        secondary={null}
                    />
                </ListItem>
            </List>
        </div>
    )
}