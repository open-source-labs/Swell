import React, { Component } from "react";
import uuid from "uuid/v4"; // (Universally Unique Identifier)--generates a unique ID
import gql from "graphql-tag";
import HeaderEntryForm from "./HeaderEntryForm.jsx";
import BodyEntryForm from "./BodyEntryForm.jsx";
import GraphQLBodyEntryForm from "./GraphQLBodyEntryForm.jsx";
import GRPCProtoEntryForm from "./GRPCProtoEntryForm.jsx";
import FieldEntryForm from "./FieldEntryForm.jsx";
import CookieEntryForm from "./CookieEntryForm.jsx";
import historyController from "../../../controllers/historyController";
import GraphQLIntrospectionLog from "./GraphQLIntrospectionLog";
import GraphQLVariableEntryForm from "./GraphQLVariableEntryForm";

const ComposerNewRequest = ({ setNewRequestFields, newRequestFields, newRequestFields: { gRPC, url, method, protocol, graphQL, restUrl, wsUrl, gqlUrl, grpcUrl, network },
  setNewRequestBody, newRequestBody, newRequestBody: { JSONFormatted, rawType, bodyContent, bodyVariables, bodyType },
  setNewRequestHeaders, newRequestHeaders, newRequestHeaders: { headersArr }, setNewRequestCookies, newRequestCookies, newRequestCookies: { cookiesArr },
  setNewRequestStreams, newRequestStreams, newRequestStreams: { selectedService, selectedRequest, selectedPackage, streamingType, initialQuery,
    streamsArr, streamContent, services, protoPath, protoContent }, 
  setNewRequestSSE, newRequestSSE: { isSSE }, currentTab, introspectionData, setComposerWarningMessage, warningMessage, reqResAdd }) => {

  const requestValidationCheck = () => {     
    const validationMessage = {};
    //Error conditions...
    if (gRPC) {
      return true;
    }
    if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
      //if url is only http/https/ws/wss://
      validationMessage.uri = "Enter a valid URI";
    }
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
      //if url doesn't have http/https/ws/wss://
      validationMessage.uri = "Enter a valid URI";
    }
    if (
      !JSONFormatted &&
      rawType === "application/json"
    ) {
      validationMessage.json = "Please fix JSON body formatting errors";
    } 
    if (method === "QUERY") {
      if (
        url &&
        !bodyContent
      ) {
        validationMessage.body = "GraphQL Body is Missing";
      } 
      if (url && bodyContent) {
        try {
          const body = gql`
          ${bodyContent}
          `;
        } catch (e) {
          console.log("error in gql-tag for client", e);
          validationMessage.body = "Invalid GraphQL Body";
        }
      }
    }
    return validationMessage;
  }

  const handleSSEPayload = (e) => {
    setNewRequestSSE(e.target.checked);
  }

  const addNewRequest = () => {
    const validated = requestValidationCheck();
    if (Object.keys(validated).length === 0) {
      
      let reqRes;
      const protocol = gRPC
        ? ""
        : url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
      // HTTP && GRAPHQL QUERY & MUTATION REQUESTS
      if (
        !/wss?:\/\//.test(protocol) &&
        !gRPC
      ) {
        const URIWithoutProtocol = `${
          url.split(protocol)[1]
        }/`;
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
            body: bodyContent || '',
            bodyType,
            bodyVariables: bodyVariables || '',
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
        const URIWithoutProtocol = `${
          url.split(protocol)[1]
        }/`;
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
            body: bodyContent || '',
            bodyType,
            bodyVariables: bodyVariables || '',
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
      // gRPC requests
      else if (gRPC) {
        // saves all stream body queries to history & reqres request body
        let streamQueries = "";
        for (
          let i = 0;
          i < streamContent.length;
          i++
        ) {
          // quries MUST be in format, do NOT edit template literal unless necessary
          streamQueries += `${streamContent[i]}
          
`;
        }
        // define array to hold client query strings
        const queryArrStr = streamContent;
        const queryArr = [];
        // scrub client query strings to remove line breaks
        // convert strings to objects and push to array
        for (let i = 0; i < queryArrStr.length; i += 1) {
          let query = queryArrStr[i];
          const regexVar = /\r?\n|\r|↵/g;
          query = query.replace(regexVar, "");
          queryArr.push(JSON.parse(query));
        }
        // grabbing streaming type to set method in reqRes.request.method
        const grpcStream = document.getElementById("stream").innerText;
        // create reqres obj to be passed to controller for further actions/tasks
        reqRes = {
          id: uuid(),
          created_at: new Date(),
          protocol: "",
          url,
          graphQL,
          gRPC,
          timeSent: null,
          timeReceived: null,
          connection: "uninitialized",
          connectionType: null,
          checkSelected: false,
          request: {
            method: grpcStream,
            headers: headersArr.filter(
              (header) => header.active && !!header.key
            ),
            body: streamQueries,
            bodyType,
            rawType,
            network,
            restUrl,
            wsUrl,
            gqlUrl,
            grpcUrl,
          },
          response: {
            cookies: [],
            headers: {},
            stream: null,
            events: [],
          },
          checked: false,
          minimized: false,
          tab: currentTab,
          service: selectedService,
          rpc: selectedRequest,
          packageName: selectedPackage,
          streamingType,
          queryArr,
          initialQuery,
          streamsArr,
          streamContent,
          servicesObj: services,
          protoPath,
          protoContent,
        };
      }
      // WEBSOCKET REQUESTS
      else {
        reqRes = {
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

      // GRPC REQUESTS
      if (gRPC) {
        setNewRequestBody({
          ...newRequestBody,
          bodyType: "GRPC",
          rawType: "",
        });
        setNewRequestFields({
          ...newRequestFields,
          url: grpcUrl,
          grpcUrl,
        });
      }

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

      if (network === 'ws') {
        setNewRequestFields({
          ...newRequestFields,
          protocol: "ws://",
          url: wsUrl,
          wsUrl,
        });
      }
      setNewRequestSSE(false);
      setComposerWarningMessage({});
    } else {
      setComposerWarningMessage(validated);
      // props.setComposerDisplay("Warning");
    }
  }

  const HeaderEntryFormStyle = {
    //trying to change style to conditional created strange duplication effect when continuously changing protocol
    display: !/wss?:\/\//.test(protocol)
      ? "block"
      : "none",
  };

  return (
    <div
      className="composerContents_content"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <h1 className="composer_title">Create New Request</h1>

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
        stylesObj={HeaderEntryFormStyle}
        newRequestHeaders={newRequestHeaders}
        newRequestStreams={newRequestStreams}
        newRequestBody={newRequestBody}
        newRequestFields={newRequestFields}
        setNewRequestHeaders={setNewRequestHeaders}
        setNewRequestStreams={setNewRequestStreams}
      />
      {method &&
        !/wss?:\/\//.test(protocol) &&
        !gRPC && (
          <CookieEntryForm
            newRequestCookies={newRequestCookies}
            newRequestBody={newRequestBody}
            setNewRequestCookies={setNewRequestCookies}
          />
        )}
      {!graphQL &&
        !gRPC &&
        method !== "GET" &&
        !/wss?:\/\//.test(protocol) && (
          <BodyEntryForm
            newRequestHeaders={newRequestHeaders}
            newRequestBody={newRequestBody}
            setNewRequestHeaders={setNewRequestHeaders}
            setNewRequestBody={setNewRequestBody}
          />
        )}
      {graphQL && (
        <>
          <GraphQLBodyEntryForm
            introspectionData={introspectionData}
            newRequestBody={newRequestBody}
            setNewRequestBody={setNewRequestBody}
            warningMessage={warningMessage}
          />
          <GraphQLVariableEntryForm
            newRequestBody={ newRequestBody }
            setNewRequestBody= { setNewRequestBody }
          />
          <GraphQLIntrospectionLog
            introspectionData={introspectionData}
            url={url}
          />
        </>
      )}
      {gRPC && (
        <GRPCProtoEntryForm
          newRequestStreams={newRequestStreams}
          setNewRequestStreams={setNewRequestStreams}
        />
      )}
      {/* SSE CHeckbox, update newRequestSSE in store */}
      {!graphQL &&
        !gRPC &&
        !/wss?:\/\//.test(protocol) && (
          <label className="composer_subtitle_SSE">
            <div className="label-text" >Server Sent Events</div>
            <span className="toggle" >
              <input
                type="checkbox"
                className="toggle-state"
                name="check"
                onChange={(e) => {handleSSEPayload(e)}}
                checked={isSSE}
              />
              <div className="indicator" />
            </span>
          </label>
        )}
        {/* {props.warningMessage} */}
      <button
        className="composer_submit"
        onClick={() => {addNewRequest()}}
        type="button"
      >
        Add New Request
      </button>
    </div>
  );
}

export default ComposerNewRequest;
