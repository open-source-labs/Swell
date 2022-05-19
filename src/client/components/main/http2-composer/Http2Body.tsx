import React from 'react';
// Http2Body needs access to the Redux store.
import { connect } from 'react-redux';
import * as actions from '../../../features/business/businessSlice';
// Import local components
import BodyTypeSelect from './BodyTypeSelect';
// Import MUI components
import { Box } from '@mui/material'
import WWWForm from '../../../components/composer/NewRequest/WWWForm';
import JSONTextArea from '../../../components/composer/NewRequest/JSONTextArea';
import TextCodeArea from '../../../components/composer/NewRequest/TextCodeArea';


const mapStateToProps = (store) => {
  return {
    newRequestHeaders: store.business.newRequestHeaders,
    newRequestBody: store.business.newRequestBody,
    warningMessage: store.business.warningMessage,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setNewRequestHeaders: (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

function Http2Body({ newRequestHeaders, newRequestBody, warningMessage, setNewRequestHeaders, setNewRequestBody}) {

  const bodyEntryArea = () => {
    //BodyType of none : display nothing
    if (newRequestBody.bodyType === 'none') {
      return;
    }
    //BodyType of XWWW... : display WWWForm entry
    if (newRequestBody.bodyType === 'x-www-form-urlencoded') {
      return (
        <WWWForm
          setNewRequestBody={setNewRequestBody}
          newRequestBody={newRequestBody}
        />
      );
    }
    //RawType of application/json : Text area box with error checking
    if (newRequestBody.rawType === 'application/json') {
      return (
        <JSONTextArea
          setNewRequestBody={setNewRequestBody}
          newRequestBody={newRequestBody}
        />
      );
    }

    return (
      <TextCodeArea
        mode={newRequestBody.rawType}
        value={newRequestBody.bodyContent}
        onChange={(value, viewUpdate) => {
          setNewRequestBody({
            ...newRequestBody,
            bodyContent: value,
          });
        }}
      />
    );
  };
  return(
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BodyTypeSelect />
      {bodyEntryArea()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Http2Body)
