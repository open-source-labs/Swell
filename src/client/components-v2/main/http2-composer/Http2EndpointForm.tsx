import React from 'react';
// Import MUI components
import { Box, Button, MenuItem, FormControl, Select, SelectChangeEvent, TextField } from '@mui/material'

export default function Http2EndpointForm(props) {
  const [method, setMethod] = React.useState('get');
  const handleMethodSelect = (event: SelectChangeEvent) => {
    setMethod(event.target.value as string);
  };
  const [uri, setUri] = React.useState('');
  const handleUriInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUri(event.target.value as string);
  };
  return(
    <Box className="http2-endpoint-form"
      sx={{
        display: 'flex',
      }}
    >
      <FormControl
        sx={{
          width: '15%'
        }}
      >
        <Select
          id="method-select"
          value={method}
          onChange={handleMethodSelect}
        >
          <MenuItem value="get">GET</MenuItem>
          <MenuItem value="post">POST</MenuItem>
          <MenuItem value="put">PUT</MenuItem>
          <MenuItem value="patch">PATCH</MenuItem>
          <MenuItem value="delete">DELETE</MenuItem>
        </Select>
      </FormControl>
      <TextField
        sx={{
          width: '85%',
          px: 1
        }}
        value={uri}
        onChange={handleUriInput}
      />
      <Button
        variant='outlined'
      >
        Send
      </Button>
    </Box>
  )
}
