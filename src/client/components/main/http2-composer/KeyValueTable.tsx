import React from 'react';
import { v4 as uuid } from 'uuid';
// Import local components
import KeyValueForm from './KeyValueForm';
// Import MUI components
import { Box, Button } from '@mui/material';

export default function KeyValueTable({ type, state, setState }) {
  console.log(`${type} state`, state)

  const keyValueForms = [];
  for (let i = 0; i < state.length; i += 1) {
    keyValueForms.push(
      <KeyValueForm
        key={state[i].id}
        type={type}
        index={i}
        state={state}
        setState={setState}
      />
    );
  }

  const handleAddNewForm = () => {
    state.push({ id: uuid(), key: '', value: '', toggle: false })
    setState([...state])
  }

  return(
    <Box
      className={`${type.toLowerCase()}-key-value-table`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {keyValueForms}
      <Button
        variant="text"
        onClick={handleAddNewForm}
      >
        {`Add New ${type}`}
      </Button>
    </Box>
  )
}
