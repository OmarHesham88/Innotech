import React from 'react';
import Box from '@mui/material/Box';

import img4 from '/public/qr.jpg';

const QR = () => {

  return (
    // <Box p={3}>
      <Box mt={3} mb={2} textAlign="center">
            <img
              src={img4}
              alt="Preview"
              style={{
                maxWidth: '300px',
                borderRadius: '7px',
                margin: '0 auto',
              }}
            />
      {/* </Box> */}
    </Box>
  );
};

export default QR;
