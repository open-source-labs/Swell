import React from 'react';
import { v4 as uuid } from 'uuid';
// Give composer access to both business Redux store slice and all actions
import { useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
// Import controllers
import connectionController from '../../controllers/reqResController';
import historyController from '../../controllers/historyController';
// Import local components
// TODO: refactor all of the below components to use MUI, place them in a new "components" folder
import GRPCTypeAndEndpointEntryForm from '../../components/composer/NewRequest/GRPCTypeAndEndpointEntryForm';
import HeaderEntryForm from '../../components/composer/NewRequest/HeaderEntryForm';
import GRPCProtoEntryForm from '../../components/composer/NewRequest/GRPCProtoEntryForm.jsx';
import NewRequestButton from '../../components/composer/NewRequest/NewRequestButton.jsx';
import TestEntryForm from '../../components/composer/NewRequest/TestEntryForm';
// Import MUI components
import { Box } from '@mui/material';

export default function GRPCComposer(props) {
  const {
    resetComposerFields,
    setNewRequestFields,
    newRequestFields,
    newRequestFields: {
      gRPC,
      url,
      webrtc,
      protocol,
      graphQL,
      restUrl,
      wsUrl,
      gqlUrl,
      grpcUrl,
      network,
      testContent,
    },
    setNewRequestBody,
    setNewTestContent,
    newRequestBody,
    newRequestBody: { rawType, bodyType },
    setNewRequestHeaders,
    newRequestHeaders,
    newRequestHeaders: { headersArr },
    setNewRequestCookies,
    newRequestCookies: { cookiesArr },
    setNewRequestStreams,
    newRequestStreams,
    newRequestStreams: {
      selectedService,
      selectedRequest,
      selectedPackage,
      streamingType,
      initialQuery,
      streamsArr,
      streamContent,
      services,
      protoPath,
      protoContent,
    },
    newRequestSSE: { isSSE },
    currentTab,
    setComposerWarningMessage,
    warningMessage,
    reqResAdd,
    setWorkspaceActiveTab,
  } = props;

  const requestValidationCheck = () => {
    interface ValidationMessage {
      uri?: string;
    };
    const validationMessage: request = {};
    //Error conditions...
    if (newRequestFields.grpcUrl) return true;
    validationMessage.uri = 'Enter a valid URI';
    return validationMessage;
  };
}
