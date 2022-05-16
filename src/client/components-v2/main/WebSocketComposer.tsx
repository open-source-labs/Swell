import React from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../controllers/historyController';
// Import local components
// TODO: refactor all of the below components to use MUI, place them in a new "components" folder
import WSEndpointEntryForm from '../../components/composer/NewRequest/WSEndpointEntryForm';
import NewRequestButton from '../../components/composer/NewRequest/NewRequestButton.jsx';
import WSTestEntryForm from '../../components/composer/NewRequest/WSTestEntryForm.jsx';
// Import MUI components
import { Box } from '@mui/material'

export default function WebSocketComposer(props) {
  const {
    setNewTestContent,
    resetComposerFields,
    setNewRequestFields,
    newRequestFields,
    newRequestFields: {
      url,
      restUrl,
      webrtc,
      wsUrl,
      gqlUrl,
      grpcUrl,
      network,
      testContent,
    },
    currentTab,
    setComposerWarningMessage,
    warningMessage,
    reqResAdd,
    setWorkspaceActiveTab,
  } = props

  const requestValidationCheck = () => {
    interface ValidationMessage {
      uri?: string;
    }
    const validationMessage: ValidationMessage = {};
    //Error conditions...
    // if url is only http/https/ws/wss://
    // OR if url doesn't contain http/https/ws/wss
    if (
      /https?:\/\/$|wss?:\/\/$/.test(url) ||
      !/(https?:\/\/)|(wss?:\/\/)/.test(url)
    ) {
      validationMessage.uri = 'Enter a valid URI';
    }
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    }

    const reqRes = {
      id: uuid(),
      createdAt: new Date(),
      protocol: url.match(/wss?:\/\//)[0],
      url,
      webrtc,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: 'WebSocket',
      checkSelected: false,
      request: {
        method: 'WS',
        messages: [],
        network,
        restUrl,
        wsUrl,
        gqlUrl,
        grpcUrl,
        testContent,
      },
      response: {
        messages: [],
      },
      checked: false,
      tab: currentTab,
    };

    // add request to history
    // TODO: fix TS type error
    historyController.addHistoryToIndexedDb(reqRes);
    reqResAdd(reqRes);

    //reset for next request
    resetComposerFields();
    setNewRequestFields({
      ...newRequestFields,
      protocol: 'ws://',
      url: wsUrl,
      wsUrl,
    });

    setWorkspaceActiveTab('workspace');
  };

  return(
    <Box className="is-flex is-flex-direction-column is-justify-content-space-between is-tall" id = "composer-websocket">
        <div
          className="is-flex-grow-3 add-vertical-scroll"
          style={{ overflowX: 'hidden' }}
        >
          <WSEndpointEntryForm
            newRequestFields={newRequestFields}
            setNewRequestFields={setNewRequestFields}
            warningMessage={warningMessage}
            setComposerWarningMessage={setComposerWarningMessage}
          />
        </div>
        <WSTestEntryForm
          setNewTestContent={setNewTestContent}
          testContent={testContent}
        />
        <div className="is-3rem-footer is-clickable is-margin-top-auto">
          <NewRequestButton onClick={addNewRequest} />
        </div>
    </Box>
  )
}
