import React, { useState } from 'react';
// Import MUI components
import { Box, Button, TextField, Checkbox } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

export default function KeyValueForm({ type, index, state, setState }) {
  const [key, setKey] = useState(state[index].key)
  const [value, setValue] = useState(state[index].value)

  const handleKeyInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    state[index].key = event.target.value;
    setKey(state[index].key)
    setState([...state]);
  }

  const handleValueInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    state[index].value = event.target.value;
    setValue(state[index].value)
    setState([...state]);
  }

  const handleDelete = () => {
    state.splice(index, 1)
    setState([...state]);
  }

  const handleToggle = () => {
    state[index].toggle = !state[index].toggle;
    setState([...state]);
  }

  return(
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
      }}
    >
      <Checkbox
        size="small"
        disableRipple={true}
        checked={state[index].toggle}
        onChange={handleToggle}
        color="success" />
      <TextField
        size="small"
        label={`${type} ${index+1}`}
        value={key}
        onChange={handleKeyInput}
        sx={{width: '25%', pr: 1 }}/>
      <TextField
        size="small"
        label={`Value ${index + 1}`}
        value={value}
        onChange={handleValueInput}
        sx={{width: '75%', pr: 1}}/>
      <Button
        color="error"
        variant="text"
        onClick={handleDelete}
        sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
      >
        <ClearRoundedIcon fontSize="small"/>
      </Button>
    </Box>
  )
}
