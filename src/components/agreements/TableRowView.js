import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'
import { shortAddress } from 'src/utils/formatNumber';

function TableRowView(props) {
    const chainId = window.ethereum.networkVersion;
    let per = Number(props.percent);
    let stakeAmount = props.amount * per / 100;

    const boolToText = (x) => {
        if (x) return 'Yes';
        return 'No';
    }

    return (
        <Card style={{ backgroundColor: 'aliceblue' }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {props.title} {props.address.toLowerCase() === props.currentAdd.toLowerCase() && '(You)'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <p className="m-0" style={{ border: '1px solid #eee', padding: '3px 15px', borderRadius: '20px', fontWeight: 'bolder', width: 'fit-content' }}>
                        {shortAddress(props.address)}
                    </p>
                </Typography>
                <Typography gutterBottom variant="h6" component="h2">
                    Stake Amount
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" >
                    {stakeAmount.toFixed(4)}  ({per}% of {props.amount} {chainId == 28 && "BOBA Rinkeby" || chainId == 80001 && "MATIC" || chainId == 3 && "ETH" || chainId == 97 && "BNB" || chainId == 43113 && "AVAX"} )
                </Typography>
                <Typography gutterBottom variant="h6" component="h2">
                    Stake
                </Typography>
                <Typography gutterBottom variant="body2" color={boolToText(props.staked) == 'No' ? 'text.danger' : 'text.success'}>
                    {boolToText(props.staked)}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default TableRowView