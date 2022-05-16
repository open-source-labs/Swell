import React, { useEffect } from 'react';
// Import local components
import KeyValueForm from './KeyValueForm';
import KeyValueTable from './KeyValueTable';
// Import MUI components
import { Box, Button, TextField, Checkbox, Grid } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

export default function Http2Parameters({ parameters, setParameters }) {
  console.log(parameters);
  /**
   * Iterate over the array of current HTTP2 request parameters.
   * For every parameter, create a new parameter entry field.
   * Regardless of how many parameters there are in the currently-drafted HTTP2 request,
   * there is always an empty entry for the user to create a new parameter.
   */
  // const parameterComponents = []
  // useEffect(() => {
  //   const parameterComponents = []
  //   for (let i = 0; i < parameters.length + 1; i++) {
  //     parameterComponents.push(
  //       <KeyValueForm
  //         type='Parameter'
  //         index={i}
  //         state={parameters}
  //         setState={setParameters}
  //       />
  //     );
  //   }
  // }, [parameters])

  // const parameterComponents = []
  // for (let i = 0; i < parameters.length + 1; i++) {
  //   parameterComponents.push(
  //     <KeyValueForm
  //       type='Parameter'
  //       index={i}
  //       state={parameters}
  //       setState={setParameters}
  //     />
  //   );
  // }

  return (
    <KeyValueTable type='Parameters' state={parameters} setState={setParameters} />
  )
}
