import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, styled } from '@mui/material';

const TooltipContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: '-45px',
    left: '85%',
    transform: 'translateX(-15%)',
    backgroundColor: theme.palette.grey[800],
    color: 'white',
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    zIndex: 1500,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-6px',
        left: '7%',
        transform: 'translateX(-50%)',
        borderWidth: '0 6px 6px 6px',
        borderStyle: 'solid',
        borderColor: `transparent transparent ${theme.palette.grey[800]} transparent`,
    }
}));

const IconTooltip = ({ content, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!content) return children;

    return (
        <Box
            position="relative"
            display="inline-flex"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
        >
            {children}
            {showTooltip && content && (
                <TooltipContainer>
                    <Typography variant="caption">{content}</Typography>
                </TooltipContainer>
            )}
        </Box>
    );
};

IconTooltip.propTypes = {
    content: PropTypes.string,
    children: PropTypes.node.isRequired
};

export default IconTooltip;