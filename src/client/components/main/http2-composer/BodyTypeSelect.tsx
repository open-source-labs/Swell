import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../../toolkit-refactor/store';

import {
  newRequestBodySet,
  newRequestHeadersSet,
} from '../../../toolkit-refactor/slices/newRequestSlice';

import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

/**@todo switch to use hooks? */
const mapStateToProps = (store: RootState) => {
  return {
    newRequestHeaders: store.newRequest.newRequestHeaders,
    newRequestBody: store.newRequest.newRequestBody,
  };
};

/**@todo switch to use hooks? */
const mapDispatchToProps = (dispatch) => ({
  newRequestHeadersSet: (requestHeadersObj) => {
    dispatch(newRequestHeadersSet(requestHeadersObj));
  },
  newRequestBodySet: (requestBodyObj) => {
    dispatch(newRequestBodySet(requestBodyObj));
  },
});

function BodyTypeSelect({
  newRequestHeaders,
  newRequestBody,
  newRequestHeadersSet,
  newRequestBodySet,
}) {
  const handleBodyTypeSelect = (event: SelectChangeEvent) => {
    newRequestBodySet({
      ...newRequestBody,
      bodyType: event.target.value,
    });
  };

  const handleRawBodyTypeSelect = (event: SelectChangeEvent) => {
    newRequestBodySet({
      ...newRequestBody,
      rawType: event.target.value,
    });
  };

  const prettifyJSON = () => {
    const prettyString = JSON.stringify(
      JSON.parse(newRequestBody.bodyContent),
      null,
      4
    );
    newRequestBodySet({
      ...newRequestBody,
      bodyContent: prettyString,
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '50%',
        py: 1,
      }}
    >
      <FormControl
        size="small"
        sx={{
          width: '50%',
          pr: 1,
        }}
      >
        <Select
          id="body-type-select"
          value={newRequestBody.bodyType}
          onChange={handleBodyTypeSelect}
        >
          <MenuItem value="raw">raw</MenuItem>
          <MenuItem value="x-www-form-urlencoded">
            x-www-form-urlencoded
          </MenuItem>
          <MenuItem value="none">none</MenuItem>
        </Select>
      </FormControl>
      {newRequestBody.bodyType === 'raw' && (
        <FormControl
          size="small"
          sx={{
            width: '50%',
            pr: 1,
          }}
        >
          <Select
            id="raw-body-type-select"
            value={newRequestBody.rawType}
            onChange={handleRawBodyTypeSelect}
          >
            <MenuItem value="text/plain">text/plain</MenuItem>
            <MenuItem value="application/json">application/json</MenuItem>
            <MenuItem value="application/javascript">
              application/javascript
            </MenuItem>
            <MenuItem value="application/xml">application/xml</MenuItem>
            <MenuItem value="text/xml">text/xml</MenuItem>
            <MenuItem value="text/html">text/html</MenuItem>
          </Select>
        </FormControl>
      )}
      {newRequestBody.bodyType === 'raw' &&
        newRequestBody.rawType === 'application/json' && (
          <Button
            sx={{
              pr: 1,
            }}
            onClick={prettifyJSON}
          >
            Prettify
          </Button>
        )}
    </Box>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyTypeSelect);
