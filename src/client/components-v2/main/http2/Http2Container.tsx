import React from 'react';

// Import local components
import Http2Composer from './Http2Composer';
import Http2Response from './Http2Response';

// Import MUI components
import { Box } from '@mui/material';

export default function Http2Container() {
  return(
    <Box>
      <Http2Composer />
      <Http2Response />
    </Box>
  )
}
