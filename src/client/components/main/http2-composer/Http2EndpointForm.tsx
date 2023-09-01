import React from 'react';

// Import MUI components
import {
  Box,
  Button,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

export default function Http2EndpointForm({
  http2Method,
  setHttp2Method,
  http2Uri,
  setHttp2Uri,
}) {
  // const [method, setMethod] = React.useState('get');
  const handleMethodSelect = (event: SelectChangeEvent) => {
    setHttp2Method(event.target.value as string);
  };
  // const [uri, setUri] = React.useState('');
  const handleUriInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHttp2Uri(event.target.value as string);
  };
  return (
    <Box
      className="http2-endpoint-form"
      sx={{
        display: 'flex',
      }}
    >
      <FormControl
        sx={{
          width: '15%',
        }}
        color="warning"
      >
        <Select
          id="method-select"
          value={http2Method}
          onChange={handleMethodSelect}
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="PATCH">PATCH</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </Select>
      </FormControl>
      <TextField
        sx={{
          width: '85%',
          px: 1,
        }}
        value={http2Uri}
        onChange={handleUriInput}
      />
      <Button variant="outlined" color="success">
        Send
      </Button>
    </Box>
  );
}
