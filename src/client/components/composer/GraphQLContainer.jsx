import React from 'react'
import uuid from "uuid/v4"; // (Universally Unique Identifier)--generates a unique ID
import gql from "graphql-tag";
import historyController from "../../controllers/historyController";
import HeaderEntryForm from "./NewRequest/HeaderEntryForm.jsx";
import FieldEntryForm from "./NewRequest/FieldEntryForm.jsx";
import GraphQLMethodAndEndpointEntryForm from './NewRequest/GraphQLMethodAndEndpointEntryForm.jsx'
import CookieEntryForm from "./NewRequest/CookieEntryForm.jsx";
import GraphQLBodyEntryForm from "./NewRequest/GraphQLBodyEntryForm.jsx";
import GraphQLVariableEntryForm from "./NewRequest/GraphQLVariableEntryForm.jsx";
import GraphQLIntrospectionLog from "./NewRequest/GraphQLIntrospectionLog.jsx";

export default function GraphQLContainer({
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
    if (method === "QUERY") {
      if (url && !bodyContent) {
        validationMessage.body = "GraphQL Body is Missing";
      }
      if (url && bodyContent) {
        try {
          const body = gql`
            ${bodyContent}
          `;
        } catch (e) {
          console.log("error in gql-tag for client", e);
          validationMessage.body = `Invalid graphQL body: \n ${e.message}`;
        }
      }
      // need to add validation check for gql variables
    }
    return validationMessage;
  };

  const addNewRequest = () => {
    const validated = requestValidationCheck();
    if (Object.keys(validated).length === 0) {
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
      // GraphQL Subscriptions
      else if (graphQL) {
        const URIWithoutProtocol = `${url.split(protocol)[1]}/`;
        const host = protocol + URIWithoutProtocol.split("/")[0];
        let path = `/${URIWithoutProtocol.split("/")
          .splice(1)
          .join("/")
          .replace(/\/{2,}/g, "/")}`;
        if (path.charAt(path.length - 1) === "/" && path.length > 1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/wss?:\//g, "ws://");
        reqRes = {
          id: uuid(),
          created_at: new Date(),
          protocol: "ws://",
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
      
      // GRAPHQL REQUESTS
      if (graphQL) {
        setNewRequestBody({
          ...newRequestBody,
          bodyType: "GQL",
          rawType: "",
        });
        setNewRequestFields({
          ...newRequestFields,
          url: gqlUrl,
          gqlUrl,
        });
      }
      setNewRequestSSE(false);
      setComposerWarningMessage({});
    } else {
      setComposerWarningMessage(validated);
      // setComposerDisplay("Warning");
    }
  };

  const HeaderEntryFormStyle = {
    //trying to change style to conditional created strange duplication effect when continuously changing protocol
    display: !/wss?:\/\//.test(protocol) ? "block" : "none",
  };

  return (
    <div
      className="composerContents_content"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <h1 className="composer_title">Create New GraphQL Request</h1>

      <GraphQLMethodAndEndpointEntryForm
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
        stylesObj={HeaderEntryFormStyle}
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
      <GraphQLBodyEntryForm
        warningMessage={warningMessage}
        newRequestBody={newRequestBody}
        setNewRequestBody={setNewRequestBody}
        introspectionData={introspectionData}
      />
      <GraphQLVariableEntryForm
        newRequestBody={newRequestBody}
        setNewRequestBody={setNewRequestBody}
      />
      <GraphQLIntrospectionLog
        introspectionData={introspectionData}
        url={url}
      />
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
