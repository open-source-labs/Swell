import React, { useRef } from "react";
import ProtocolSelect from "./ProtocolSelect.jsx";
import colors from "../../../../assets/style/colors.scss";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";

const FieldEntryForm = (props) => {
  // this.handleKeyPress = this.handleKeyPress.bind(this); <-- never used?

  const onChangeHandler = (e, property, graphQL) => {
    const value = e.target.value;
    if (props.warningMessage.uri) {
      const warningMessage = { ...props.warningMessage };
      delete warningMessage.uri;
      props.setComposerWarningMessage({ ...warningMessage });
    }
    switch (property) {
      case "url": {
        const url = value;
        props.setNewRequestFields({
          ...props.newRequestFields,
          url,
        });
        break;
      }
      case "protocol": {
        props.setComposerWarningMessage({});

        if (graphQL) {
          //if graphql
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: "",
            // url: `http://${afterProtocol}`,
            url: "http://",
            method: "QUERY",
            graphQL: true,
            gRPC: false,
          });
          props.setNewRequestBody({
            //when switching to GQL clear body
            ...props.newRequestBody,
            bodyType: "GQL",
            bodyContent: `query {

}`,
          });
          break;
        } else if (value === "http://") {
          //if http/s
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: "",
            // url: `http://${afterProtocol}`,
            url: "http://",
            method: "GET",
            graphQL: false,
            gRPC: false,
          });
          props.setNewRequestBody({
            //when switching to http clear body
            ...props.newRequestBody,
            bodyType: "none",
            bodyContent: ``,
          });
          break;
        } else if (value === "") {
          //if gRPC
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: "",
            // url: `${afterProtocol}`,
            url: "",
            method: "",
            graphQL: false,
            gRPC: true,
          });
          props.setNewRequestBody({
            //when switching to gRPC clear body
            ...props.newRequestBody,
            bodyType: "GRPC",
            bodyContent: ``,
          });
          break;
        } else if (value === "ws://") {
          //if ws
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: value,
            // url: value + afterProtocol,
            url: "ws://",
            method: "",
            graphQL: false,
            gRPC: false,
          });
          props.setNewRequestBody({
            ...props.newRequestBody,
            bodyType: "none",
            bodyContent: "",
          });
        }
        //removes Content-Type Header
        const filtered = props.newRequestHeaders.headersArr.filter(
          (header) => header.key.toLowerCase() !== "content-type"
        );
        props.setNewRequestHeaders({
          headersArr: filtered,
          count: filtered.length,
        });
        break;
      }
      case "method": {
        const methodReplaceRegex = new RegExp(
          `${props.newRequestFields.method}`,
          "mi"
        );
        let newBody = "";
        if (!props.newRequestFields.graphQL && !props.newRequestFields.gRPC) {
          //if one of 5 http methods (get, post, put, patch, delete)
          props.setNewRequestBody({
            ...props.newRequestBody,
            bodyType: "raw",
            bodyContent: "",
          });
        }
        // GraphQL features
        else if (value === "QUERY") {
          //if switching to graphQL = true
          if (!props.newRequestFields.graphQL)
            newBody = `query {

}`;
          else
            newBody = methodReplaceRegex.test(props.newRequestBody.bodyContent)
              ? props.newRequestBody.bodyContent.replace(
                  methodReplaceRegex,
                  "query"
                )
              : `query ${props.newRequestBody.bodyContent}`;

          props.setNewRequestBody({
            ...props.newRequestBody,
            bodyContent: newBody,
          });
        } else if (value === "MUTATION") {
          newBody = methodReplaceRegex.test(props.newRequestBody.bodyContent)
            ? props.newRequestBody.bodyContent.replace(
                methodReplaceRegex,
                "mutation"
              )
            : `mutation ${props.newRequestBody.bodyContent}`;

          props.setNewRequestBody({
            ...props.newRequestBody,
            bodyContent: newBody,
          });
        } else if (value === "SUBSCRIPTION") {
          newBody = methodReplaceRegex.test(props.newRequestBody.bodyContent)
            ? props.newRequestBody.bodyContent.replace(
                methodReplaceRegex,
                "subscription"
              )
            : `subscription ${props.newRequestBody.bodyContent}`;

          props.setNewRequestBody({
            ...props.newRequestBody,
            bodyContent: newBody,
          });
        }

        //always set new method
        props.setNewRequestFields({
          ...props.newRequestFields,
          method: value,
          protocol: value === "SUBSCRIPTION" ? "ws://" : "",
          url: value === "SUBSCRIPTION" ? "ws://" : "https://",
        });
      }
    }
  };

  const borderColor = props.warningMessage.uri ? "red" : "white";
  const inputEl = useRef(null);
  return (
    <div>
      <ProtocolSelect
        currentProtocol={props.newRequestFields.protocol}
        onChangeHandler={onChangeHandler}
        graphQL={props.newRequestFields.graphQL}
        gRPC={props.newRequestFields.gRPC}
        setComposerWarningMessage={props.setComposerWarningMessage}
      />

      <div className="composer_method_url_container">
        {/* below conditional method selection rendering for http/s */}
        {!/wss?:\/\//.test(props.newRequestFields.protocol) &&
          !props.newRequestFields.graphQL &&
          !props.newRequestFields.gRPC && (
            <select
              style={{ display: "block" }}
              value={props.newRequestFields.method}
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
          )}
        {/* below conditional method selection rendering for graphql */}
        {
          // !/wss?:\/\//.test(props.newRequestFields.protocol) &&
          props.newRequestFields.graphQL && (
            <select
              style={{ display: "block" }}
              value={props.newRequestFields.method}
              className="composer_method_select gql"
              onChange={(e) => {
                onChangeHandler(e, "method");
              }}
            >
              <option value="QUERY">QUERY</option>
              <option value="MUTATION">MUTATION</option>
              <option value="SUBSCRIPTION">SUBSCRIPTION</option>
            </select>
          )
        }

        {/* gRPC stream type button */}
        {props.newRequestFields.gRPC && (
          <button
            style={{ display: "block" }}
            id="stream"
            value="STREAM"
            className="composer_method_select grpc"
          >
            STREAM
          </button>
        )}

        <input
          className="composer_url_input"
          type="text"
          placeholder="URL"
          style={{ borderColor }}
          value={props.newRequestFields.url}
          onChange={(e) => {
            onChangeHandler(e, "url");
          }}
          // onKeyPress={this.handleKeyPress} <-- old func that was not defined
          ref={(input) => {
            inputEl.current = input;
          }}
         />
      </div>
      {props.warningMessage.uri && (
        <div className="warningMessage">{props.warningMessage.uri}</div>
      )}
    </div>
  );
};

export default FieldEntryForm;