import React, { useState, useRef } from "react";

/* eslint-disable */

// import ProtocolSelect from "./ProtocolSelect.jsx";

const GraphQLMethodAndEndpointEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
  setNewRequestBody,
  newRequestBody,
  setNewRequestHeaders,
  newRequestStreams,
  newRequestHeaders: { headersArr },
}) => {
  const onChangeHandler = (e, property, network) => {
    const value = e.target.value;
    if (warningMessage.uri) {
      const warningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setComposerWarningMessage({ ...warningMessage });
    }
    switch (property) {
      
      case "protocol": {
        setComposerWarningMessage({});

        
          //if graphql
          setNewRequestFields({
            ...newRequestFields,
            protocol: "",
            url: newRequestFields.gqlUrl,
            method: "QUERY",
            graphQL: true,
            gRPC: false,
            network: "graphQL",
          });
          setNewRequestBody({
            //when switching to GQL clear body
            ...newRequestBody,
            bodyType: "GQL",
            bodyContent: `query {

}`,
            bodyVariables: "",
          });
          
       
        //removes Content-Type Header
        const filtered = headersArr.filter(
          (header) => header.key.toLowerCase() !== "content-type"
        );
        setNewRequestHeaders({
          headersArr: filtered,
          count: filtered.length,
        });
        break;
      }
      case "method": {
        let newBody;
        const methodReplaceRegex = new RegExp(
          `${newRequestFields.method}`,
          "mi"
        );
        
        // GraphQL features
        if (value === "QUERY") {
          if (!newRequestFields.graphQL)
            newBody = `query {

}`;
          else
            newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
              ? newRequestBody.bodyContent.replace(methodReplaceRegex, "query")
              : `query ${newRequestBody.bodyContent}`;

          setNewRequestBody({
            ...newRequestBody,
            bodyContent: newBody,
            bodyIsNew: false,
          });
        } else if (value === "MUTATION") {
          newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
            ? newRequestBody.bodyContent.replace(methodReplaceRegex, "mutation")
            : `mutation ${newRequestBody.bodyContent}`;

          setNewRequestBody({
            ...newRequestBody,
            bodyContent: newBody,
            bodyIsNew: false,
          });
        } else if (value === "SUBSCRIPTION") {
          newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
            ? newRequestBody.bodyContent.replace(
                methodReplaceRegex,
                "subscription"
              )
            : `subscription ${newRequestBody.bodyContent}`;

          setNewRequestBody({
            ...newRequestBody,
            bodyContent: newBody,
            bodyIsNew: false,
          });
        }

        //always set new method
        setNewRequestFields({
          ...newRequestFields,
          method: value,
          protocol: value === "SUBSCRIPTION" ? "ws://" : "",
          // url: value === "SUBSCRIPTION" ? "ws://" : "https://",
        });
      }
    }
  };

  const borderColor = warningMessage.uri ? "red" : "white";
  const inputEl = useRef(null);
  const grpcStreamLabel = newRequestStreams.selectedStreamingType || "STREAM";
  return (
    <div>
      {/* OLD PROTOCOL SELECTION COMPONENT */}
      {/* <ProtocolSelect
        currentProtocol={newRequestFields.protocol}
        onChangeHandler={onChangeHandler}
        graphQL={newRequestFields.graphQL}
        gRPC={newRequestFields.gRPC}
        setComposerWarningMessage={setComposerWarningMessage}
      /> */}

      <div>
        ************** FieldEntryForm **************
        {/* below conditional method selection rendering for http/s */}
        {newRequestFields.network === "rest" && (
          <div className="composer_method_url_container">
            <select
              style={{ display: "block" }}
              value={newRequestFields.method}
              className="composer_method_select http"
              onChange={(e) => {
                onChangeHandler(e, "method");
              }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              className="composer_url_input"
              type="text"
              placeholder="URL"
              style={{ borderColor }}
              value={newRequestFields.restUrl}
              onChange={(e) => {
                onChangeHandler(e, "url", newRequestFields.network);
              }}
              ref={(input) => {
                inputEl.current = input;
              }}
            />
          </div>
        )}

        {/* below conditional rendering for ws */}
        {newRequestFields.network === "ws" && (
          <input
            className="composer_url_input"
            type="text"
            placeholder="URL"
            style={{ borderColor }}
            value={newRequestFields.wsUrl}
            onChange={(e) => {
              onChangeHandler(e, "url", newRequestFields.network);
            }}
            ref={(input) => {
              inputEl.current = input;
            }}
          />
        )}

        {/* below conditional method selection rendering for graphql */}
        {newRequestFields.network === "graphQL" && (
          <div className="composer_method_url_container">
            <select
              style={{ display: "block" }}
              value={newRequestFields.method}
              className="composer_method_select gql"
              onChange={(e) => {
                onChangeHandler(e, "method");
              }}
            >
              <option value="QUERY">QUERY</option>
              <option value="MUTATION">MUTATION</option>
              <option value="SUBSCRIPTION">SUBSCRIPTION</option>
            </select>
            <input
              className="composer_url_input"
              type="text"
              placeholder="URL"
              style={{ borderColor }}
              value={newRequestFields.gqlUrl}
              onChange={(e) => {
                onChangeHandler(e, "url", newRequestFields.network);
              }}
              ref={(input) => {
                inputEl.current = input;
              }}
            />
          </div>
        )}

        {/* gRPC stream type button */}
        {newRequestFields.network === "grpc" && (
          <div className="composer_method_url_container">
            <button
              style={{ display: "block" }}
              id="stream"
              value="STREAM"
              className="composer_method_select grpc"
            >
              {grpcStreamLabel}
            </button>
            <input
              className="composer_url_input"
              type="text"
              placeholder="URL"
              style={{ borderColor }}
              value={newRequestFields.grpcUrl}
              onChange={(e) => {
                onChangeHandler(e, "url", newRequestFields.network);
              }}
              ref={(input) => {
                inputEl.current = input;
              }}
            />
          </div>
        )}
      </div>

      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};


export default GraphQLMethodAndEndpointEntryForm;
