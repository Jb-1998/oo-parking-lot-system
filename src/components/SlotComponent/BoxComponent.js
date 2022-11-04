import React from 'react';
import { Box, Typography } from '@mui/material';

function BoxComponent({ color, description }) {
  
  return (
    <Box 
      sx={{
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          marginTop: 2,
          marginRight: 2
      }}
    >
      <span style={{ backgroundColor: color}} className='box-style'></span>
      <Typography 
          variant='inherit'
          className='config-description'
          style={{ marginLeft: 10, fontSize: 10 }}
      >
          {description}
      </Typography>
    </Box>
  )
}

export default BoxComponent;
