import React from 'react'
import HeaderEntryForm from "./NewRequest/HeaderEntryForm.jsx";
import BodyEntryForm from "./NewRequest/BodyEntryForm.jsx";
import FieldEntryForm from "./NewRequest/FieldEntryForm.jsx";
import CookieEntryForm from "./NewRequest/CookieEntryForm.jsx";

export default function RestContainer({
  setNewRequestFields,
  newRequestFields,
  newRequestFields: {
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
    if (!JSONFormatted && rawType === "application/json") {
      validationMessage.json = "Please fix JSON body formatting errors";
    }
    return validationMessage;
  };

  const addNewRequest = () => {
    const validated = requestValidationCheck();
    if (Object.keys(validated).length === 0) {
      let reqRes;
      
      // HTTP && GRAPHQL QUERY & MUTATION REQUESTS
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

      // add request to history
      historyController.addHistoryToIndexedDb(reqRes);
      reqResAdd(reqRes);

      //reset for next request
      setNewRequestHeaders({
        headersArr: [],
        count: 0,
      });

      setNewRequestStreams({
        ...newRequestStreams,
      });

      setNewRequestCookies({
        cookiesArr: [],
        count: 0,
      });

      setNewRequestBody({
        ...newRequestBody,
        bodyContent: "",
        bodyVariables: "",
        bodyType: "raw",
        rawType: "Text (text/plain)",
        JSONFormatted: true,
      });

      setNewRequestFields({
        ...newRequestFields,
        method,
        protocol: "",
        url,
        restUrl,
        wsUrl,
        gqlUrl,
        grpcUrl,
        graphQL,
        gRPC,
      });

      setNewRequestSSE(false);
      setComposerWarningMessage({});
    } else {
      setComposerWarningMessage(validated);
    }
  };

  const handleSSEPayload = (e) => {
    setNewRequestSSE(e.target.checked);
  };

  return (
    <div
      className="composerContents_content"
      tabIndex={0}
    >
      <h1 className="composer_title">Create New REST Request</h1>

      <FieldEntryForm
        newRequestFields={newRequestFields}
        newRequestHeaders={newRequestHeaders}
        newRequestStreams={newRequestStreams}
        newRequestBody={newRequestBody}
        setNewRequestFields={setNewRequestFields}
        setNewRequestHeaders={setNewRequestHeaders}
        setNewRequestStreams={setNewRequestStreams}
        setNewRequestCookies={setNewRequestCookies}
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
      {/* SSE CHeckbox, update newRequestSSE in store */}
      <label className="composer_subtitle_SSE">
        <div className="label-text">Server Sent Events</div>
        <span className="toggle">
          <input
            type="checkbox"
            className="toggle-state"
            name="check"
            onChange={(e) => {
              handleSSEPayload(e);
            }}
            checked={isSSE}
          />
          <div className="indicator" />
        </span>
      </label>

      <button
        className="composer_submit"
        onClick={() => {
          addNewRequest();
        }}
        type="button"
      >
        Add New Request
      </button>
    </div>
  )
}
