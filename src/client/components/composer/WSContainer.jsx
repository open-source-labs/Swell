import React from 'react'
import uuid from "uuid/v4"; // (Universally Unique Identifier)--generates a unique ID
import historyController from "../../controllers/historyController";
import WSEndpointEntryForm from './NewRequest/WSEndpointEntryForm';

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
  setNewRequestBody,
  newRequestBody,
  newRequestBody: {
    JSONFormatted,
    rawType,
    bodyContent,
    bodyVariables,
    bodyType,
  },
  setNewRequestHeaders,
  newRequestHeaders,
  newRequestHeaders: { headersArr },
  setNewRequestCookies,
  newRequestCookies,
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
  setNewRequestSSE,
  newRequestSSE: { isSSE },
  currentTab,
  introspectionData,
  setComposerWarningMessage,
  setComposerDisplay,
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
    // setNewRequestHeaders({
    //   headersArr: [],
    //   count: 0,
    // });

    // setNewRequestStreams({
    //   ...newRequestStreams,
    // });

    // setNewRequestCookies({
    //   cookiesArr: [],
    //   count: 0,
    // });

    // setNewRequestBody({
    //   ...newRequestBody,
    //   bodyContent: "",
    //   bodyVariables: "",
    //   bodyType: "raw",
    //   rawType: "Text (text/plain)",
    //   JSONFormatted: true,
    // });

    // setNewRequestFields({
    //   ...newRequestFields,
    //   method,
    //   protocol: "",
    //   url,
    //   restUrl,
    //   wsUrl,
    //   gqlUrl,
    //   grpcUrl,
    //   graphQL,
    //   gRPC,
    // });

    resetComposerFields();

    setNewRequestFields({
      ...newRequestFields,
      protocol: "ws://",
      url: wsUrl,
      wsUrl,
    });

    setNewRequestSSE(false);
    setComposerWarningMessage({});
  };

  return (
    <div>
      <WSEndpointEntryForm
        newRequestFields={newRequestFields}
        setNewRequestFields={setNewRequestFields}
        warningMessage={warningMessage}
        setComposerWarningMessage={setComposerWarningMessage}
      />
      <button onClick={addNewRequest}>
        Add New Request
      </button>
    </div>
  )
}
