import React from 'react';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Button } from '@mui/material';

export default function DeleteRequestButton(props) {
  const handleDeleteRequest = (event) => {
    console.log(event);
    return null;
  }

  return(
    <Button
      color="error"
      variant="text"
      sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
      onClick={handleDeleteRequest}
    >
      <ClearRoundedIcon fontSize="small"/>
    </Button>
  )
}
