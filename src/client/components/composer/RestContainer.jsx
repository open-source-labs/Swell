import React from 'react'
import uuid from "uuid/v4"; // (Universally Unique Identifier)--generates a unique ID
import historyController from "../../controllers/historyController";
import HeaderEntryForm from "./NewRequest/HeaderEntryForm";
import BodyEntryForm from "./NewRequest/BodyEntryForm.jsx";
import CookieEntryForm from "./NewRequest/CookieEntryForm.jsx";
import RestMethodAndEndpointEntryForm from "./NewRequest/RestMethodAndEndpointEntryForm.jsx";
import NewRequestButton from './NewRequest/NewRequestButton.jsx'


export default function RestContainer({
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
  setWorkspaceActiveTab,
}) {
  const requestValidationCheck = () => {
    const validationMessage = {};
    //Error conditions...
    if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
      //if url is only http/https/ws/wss://
      validationMessage.uri = "Enter a valid URI";
    }
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
      //if url doesn't have http/https/ws/wss://
      validationMessage.uri = "Enter a valid URI";
    }
    if (!JSONFormatted && rawType === "application/json") {
      validationMessage.json = "Please fix JSON body formatting errors";
    }
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    } 

    let reqRes;
    const protocol = url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
    // HTTP && GRAPHQL QUERY & MUTATION REQUESTS
    if (!/wss?:\/\//.test(protocol) && !gRPC) {
      const URIWithoutProtocol = `${url.split(protocol)[1]}/`;
      const host = protocol + URIWithoutProtocol.split("/")[0];
      let path = `/${URIWithoutProtocol.split("/")
        .splice(1)
        .join("/")
        .replace(/\/{2,}/g, "/")}`;
      if (path.charAt(path.length - 1) === "/" && path.length > 1) {
        path = path.substring(0, path.length - 1);
      }
      path = path.replace(/https?:\//g, "http://");
      reqRes = {
        id: uuid(),
        created_at: new Date(),
        protocol: url.match(/https?:\/\//)[0],
        host,
        path,
        url,
        graphQL,
        gRPC,
        timeSent: null,
        timeReceived: null,
        connection: "uninitialized",
        connectionType: null,
        checkSelected: false,
        protoPath,
        request: {
          method,
          headers: headersArr.filter(
            (header) => header.active && !!header.key
          ),
          cookies: cookiesArr.filter(
            (cookie) => cookie.active && !!cookie.key
          ),
          body: bodyContent || "",
          bodyType,
          bodyVariables: bodyVariables || "",
          rawType,
          isSSE,
          network,
          restUrl,
          wsUrl,
          gqlUrl,
          grpcUrl,
        },
        response: {
          headers: null,
          events: null,
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };
    }
    
    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResAdd(reqRes);
    
    //reset for next request
    resetComposerFields();
    setWorkspaceActiveTab('workspace');
  };

  const handleSSEPayload = (e) => {
    setNewRequestSSE(e.target.checked);
  };

  return (
    <div className='is-flex is-flex-direction-column is-justify-content-space-between is-tall'>
      <div className="is-flex-grow-3 add-vertical-scroll">
        <RestMethodAndEndpointEntryForm
          newRequestFields={newRequestFields}
          newRequestBody={newRequestBody}
          setNewRequestFields={setNewRequestFields}
          setNewRequestBody={setNewRequestBody}
          warningMessage={warningMessage}
          setComposerWarningMessage={setComposerWarningMessage}
        />
        <HeaderEntryForm
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          setNewRequestHeaders={setNewRequestHeaders}
          setNewRequestStreams={setNewRequestStreams}
        />
        <CookieEntryForm
          newRequestCookies={newRequestCookies}
          newRequestBody={newRequestBody}
          setNewRequestCookies={setNewRequestCookies}
        />
        {method !== "GET" && (
          <BodyEntryForm
            warningMessage={warningMessage}
            newRequestBody={newRequestBody}
            setNewRequestBody={setNewRequestBody}
            newRequestHeaders={newRequestHeaders}
            setNewRequestHeaders={setNewRequestHeaders}
          />
        )}

        {/* SSE TOGGLE SWITCH */}
        <div className="field mt-2">
          <span className="composer-section-title mr-3">Server Sent Events</span>  
            <input 
              id="SSEswitch"
              type="checkbox" 
              className="switch is-outlined is-warning" 
              onChange={(e) => {
                handleSSEPayload(e);
              }}
              checked={isSSE}
            ></input>
            <label htmlFor="SSEswitch">
            </label>
        </div>
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </div>
  );
}
