import React, { useState } from 'react'
 
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from '@mui/material';

function CopyAddress({ address }) {
    const [copySuccess, setCopySuccess] = useState("Copy");

    const copyToClipBoard = async (copyMe) => {
        try {
            await navigator.clipboard.writeText(copyMe);
            setCopySuccess('Copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };

    return (
        <Tooltip title={copySuccess == "Copy" ? "Copy" : "Copied!"}>
            <ContentCopyIcon style={{ cursor: "pointer" }} className="mx-2 mt-1" onClick={() => copyToClipBoard(address)} />
        </Tooltip>
    )
}

export default CopyAddress