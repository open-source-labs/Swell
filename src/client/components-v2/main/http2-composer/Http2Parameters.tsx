import React from 'react';
// Import MUI components
import { Box, Button, TextField, Checkbox, Grid } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

export default function Http2Parameters({ parameters, setParameters }) {
  console.log(parameters);
  const handleParameterInput = () => {
    
  }

  /**
   * Iterate over the array of current HTTP2 request parameters.
   * For every parameter, create a new parameter entry field.
   * Regardless of how many parameters there are in the currently-drafted HTTP2 request,
   * there is always an empty entry for the user to create a new parameter.
   */
  const defaultParameterComponent =
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        pt: 1,
      }}
    >
      <Checkbox size="small" disableRipple={true} color="success" />
      <TextField size="small" sx={{width: '25%'}}/>
      <TextField size="small" sx={{width: '75%', px: 1}}/>
      <Button
        color="error"
        variant="text"
        onClick={() => console.log('delete param')}
        sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
      >
        <ClearRoundedIcon fontSize="small"/>
      </Button>
    </Box>
  const parameterComponents = []
  for (let i = 0; i < parameters.length; i++) {

  }
  parameterComponents.push(defaultParameterComponent);



  return (
    <Box
      className="http2-parameters"
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {parameterComponents}
    </Box>
  )
}
