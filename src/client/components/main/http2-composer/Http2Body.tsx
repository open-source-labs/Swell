import React from 'react';
// Http2Body needs access to the Redux store.
import { connect } from 'react-redux';

import { AppDispatch, RootState } from '../../../toolkit-refactor/store';
import { $TSFixMeObject } from '../../../../types';

import {
  newRequestBodySet,
  newRequestHeadersSet,
} from '../../../toolkit-refactor/slices/newRequestSlice';

// Import local components
import BodyTypeSelect from './BodyTypeSelect';
// Import MUI components
import { Box } from '@mui/material';
import WWWForm from '../../../components/main/new-request/WWWForm';
import JSONTextArea from '../../../components/main/new-request/JSONTextArea';
import TextCodeArea from '../../../components/main/new-request/TextCodeArea';

/**@todo switch to hooks? */
const mapStateToProps = (store: RootState) => {
  return {
    newRequestHeaders: store.newRequest.newRequestHeaders,
    newRequestBody: store.newRequest.newRequestBody,
    warningMessage: store.warningMessage,
  };
};

/**@todo switch to hooks? */
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  newRequestHeadersSet: (requestHeadersObj: $TSFixMeObject) => {
    dispatch(newRequestHeadersSet(requestHeadersObj));
  },
  newRequestBodySet: (requestBodyObj: $TSFixMeObject) => {
    dispatch(newRequestBodySet(requestBodyObj));
  },
});

function Http2Body({
  newRequestHeaders,
  newRequestBody,
  warningMessage,
  newRequestHeadersSet,
  newRequestBodySet,
}) {
  const bodyEntryArea = () => {
    //BodyType of none : display nothing
    if (newRequestBody.bodyType === 'none') {
      return;
    }
    //BodyType of XWWW... : display WWWForm entry
    if (newRequestBody.bodyType === 'x-www-form-urlencoded') {
      return (
        <WWWForm
          newRequestBodySet={newRequestBodySet}
          newRequestBody={newRequestBody}
        />
      );
    }
    //RawType of application/json : Text area box with error checking
    if (newRequestBody.rawType === 'application/json') {
      return (
        <JSONTextArea
          newRequestBodySet={newRequestBodySet}
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BodyTypeSelect />
      {bodyEntryArea()}
    </Box>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Http2Body);
