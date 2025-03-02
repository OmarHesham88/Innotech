import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import img4 from '/public/logoo.png';

const Logo = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(img4);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024 * 5) {
      alert('File size is too large! Max 5MB allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    console.log(imageFile);
  };

  return (
    <Box p={1}>
      {/* <Typography variant="h5">الشعار</Typography> */}
      <Box mt={3} mb={2} textAlign="center">


        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {imageUrl ? (
          <Box>
            <img
              src={imageUrl}
              alt="Preview"
              onClick={handleImageClick}
              style={{
                maxWidth: '368px',
                borderRadius: '7px',
                margin: '0 auto',
                cursor:'pointer',
                padding:'30px'
              }}
            />
          </Box>
        ) : null}

<Typography variant="body2" textAlign="center">
          اضغط على الصورة لتغييرها
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
