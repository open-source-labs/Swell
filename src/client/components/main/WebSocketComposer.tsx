import React from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../controllers/historyController';
// Import local components
/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */
import WSEndpointEntryForm from './new-request/WSEndpointEntryForm';
import NewRequestButton from './new-request/NewRequestButton.jsx';
import TestEntryForm from './new-request/TestEntryForm';
// Import MUI components
import { Box } from '@mui/material';

export default function WebSocketComposer(props) {
  const {
    newTestContentSet,
    fieldsReplaced,
    composerFieldsReset,
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
    setWarningMessage,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

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
      setWarningMessage(warnings);
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
    /** @todo Fix TS type error */
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);

    //reset for next request
    composerFieldsReset();
    fieldsReplaced({
      ...newRequestFields,
      protocol: 'ws://',
      url: wsUrl,
      wsUrl,
    });

    setWorkspaceActiveTab('workspace');
  };

  return (
    <Box
      className="is-flex-grow-3 add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="composer-websocket"
    >
      <div className="container-margin">
        <div
          className="is-flex-grow-3 add-vertical-scroll"
          style={{ overflowX: 'hidden' }}
        >
          <WSEndpointEntryForm
            newRequestFields={newRequestFields}
            fieldsReplaced={fieldsReplaced}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
          />
        </div>
        <TestEntryForm
          isWebSocket="true"
          newTestContentSet={newTestContentSet}
          testContent={testContent}
        />
        <div className="is-3rem-footer is-clickable is-margin-top-auto">
          <NewRequestButton onClick={addNewRequest} />
        </div>
      </div>
    </Box>
  );
}
