import React from 'react'
import uuid from "uuid/v4"; // (Universally Unique Identifier)--generates a unique ID
import historyController from "../../controllers/historyController";
import WSEndpointEntryForm from './NewRequest/WSEndpointEntryForm';
import NewRequestButton from './NewRequest/NewRequestButton.jsx'

export default function WSContainer({
  resetComposerFields,
  setNewRequestFields,
  newRequestFields,
  newRequestFields: {
    gRPC,
    url,
    method,
    protocol,
    graphQL,
    restUrl,
    wsUrl,
    gqlUrl,
    grpcUrl,
    network,
  },
  setNewRequestSSE,
  currentTab,
  setComposerWarningMessage,
  warningMessage,
  reqResAdd,
}) {
  const requestValidationCheck = () => {
    const validationMessage = {};
    //Error conditions...
    // if url is only http/https/ws/wss://
    // OR if url doesn't contain http/https/ws/wss
    if ((/https?:\/\/$|wss?:\/\/$/.test(url)) 
      || (!/(https?:\/\/)|(wss?:\/\/)/.test(url))) {
      validationMessage.uri = "Enter a valid URI";
    }
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    } 

    const protocol = url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
  
    const reqRes = {
      id: uuid(),
      created_at: new Date(),
      protocol: url.match(/wss?:\/\//)[0],
      url,
      timeSent: null,
      timeReceived: null,
      connection: "uninitialized",
      connectionType: "WebSocket",
      checkSelected: false,
      request: {
        method: "WS",
        messages: [],
        network,
        restUrl,
        wsUrl,
        gqlUrl,
        grpcUrl,
      },
      response: {
        messages: [],
      },
      checked: false,
      tab: currentTab,
    };
      
    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResAdd(reqRes);

    //reset for next request
    resetComposerFields();

    setNewRequestFields({
      ...newRequestFields,
      protocol: "ws://",
      url: wsUrl,
      wsUrl,
    });
  };

  return (
    <div className='is-flex is-flex-direction-column is-justify-content-space-between is-tall'>
      <div className=" is-flex-grow-3 add-vertical-scroll">
        <WSEndpointEntryForm
          newRequestFields={newRequestFields}
          setNewRequestFields={setNewRequestFields}
          warningMessage={warningMessage}
          setComposerWarningMessage={setComposerWarningMessage}
        />
      </div>
      <div className="is-graph-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </div>
  )
}
