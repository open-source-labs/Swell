import React from 'react';
// Import MUI components
import { Box, TextField, Button } from '@mui/material';

export default function Http2Headers() {
  return (
    <Box
      className="http2-parameters"
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <TextField sx={{width: '25%'}}/>
        <TextField sx={{width: '75%'}}/>
      </Box>
    </Box>
  )
}
