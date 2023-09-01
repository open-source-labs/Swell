import React from 'react';
import { useAppDispatch, useAppSelector } from '~/toolkit/store';
import { newRequestBodySet } from '~/toolkit/slices/newRequestSlice';

import { type NewRequestBody } from '~/types';

// Import local components
import BodyTypeSelect from './BodyTypeSelect';

// Import MUI components
import { Box } from '@mui/material';
import WWWForm from '../sharedComponents/requestForms/WWWForm';
import JSONTextArea from '../sharedComponents/JSONTextArea';
import TextCodeArea from '../sharedComponents/TextCodeArea';

function Http2Body() {
  const dispatch = useAppDispatch();
  const newRequestBody = useAppSelector(
    (store) => store.newRequest.newRequestBody
  );

  const setBody = (newBod: NewRequestBody) => {
    dispatch(newRequestBodySet(newBod));
  };

  const bodyEntryPicker = () => {
    //BodyType of none : display nothing
    if (newRequestBody.bodyType === 'none') {
      return null;
    }

    //BodyType of XWWW... : display WWWForm entry
    if (newRequestBody.bodyType === 'x-www-form-urlencoded') {
      return (
        <WWWForm newRequestBodySet={setBody} newRequestBody={newRequestBody} />
      );
    }

    //RawType of application/json : Text area box with error checking
    if (newRequestBody.rawType === 'application/json') {
      return (
        <JSONTextArea
          newRequestBodySet={setBody}
          newRequestBody={newRequestBody}
        />
      );
    }

    return (
      <TextCodeArea
        mode={newRequestBody.rawType}
        value={newRequestBody.bodyContent}
        onChange={(value, viewUpdate) => {
          newRequestBodySet({
            ...newRequestBody,
            bodyContent: value,
          });
        }}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <BodyTypeSelect />
      {bodyEntryPicker()}
    </Box>
  );
}

export default Http2Body;
