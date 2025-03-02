import React from 'react';
import { Box, Typography } from '@mui/material';
import { IconInfoCircle } from '@tabler/icons';

const InputExplanation = ({ text, show = true, sx = {} }) => {
  if (!show) return null;
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'flex-start', 
        mt: 1,
        // color: 'grey.400',
        color: 'warning.dark',
        ...sx
      }}
    >
      <IconInfoCircle 
        size={16} 
        style={{ 
          marginRight: 8,
          marginTop: 2,
          flexShrink: 0
        }} 
      />
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'inherit',
          lineHeight: 1.5
        }}
      >
        &nbsp;{text}
      </Typography>
    </Box>
  );
};

export default InputExplanation;