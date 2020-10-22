/* eslint-disable default-case */
import React, { useRef } from "react";
// import ProtocolSelect from "./ProtocolSelect.jsx";

const RestMethodAndEndpointEntryForm = ({
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
      case "url": {
        const url = value;
        setNewRequestFields({
          ...newRequestFields,
          restUrl: url,
          url,
        }); 
        break;
      }
      case "protocol": {
        setComposerWarningMessage({});
          setNewRequestFields({
            ...newRequestFields,
            protocol: "",
            url: newRequestFields.restUrl,
            method: "GET",
            graphQL: false,
            gRPC: false,
            network: "rest",
          });
          setNewRequestBody({
            //when switching to http clear body
            ...newRequestBody,
            bodyType: "none",
            bodyContent: ``,
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
        const methodReplaceRegex = new RegExp(
          `${newRequestFields.method}`,
          "mi"
        );
        const newBody = "";
        
          //if one of 5 http methods (get, post, put, patch, delete)
          setNewRequestBody({
            ...newRequestBody,
            bodyType: "raw",
            bodyContent: "",
          });
        
        //always set new method
        setNewRequestFields({
          ...newRequestFields,
          method: value,
          protocol: value === "",
        });
      }
    }
  };

  const borderColor = warningMessage.uri ? "red" : "white";
  const inputEl = useRef(null);
  const grpcStreamLabel = newRequestStreams.selectedStreamingType || "STREAM";
  return (
    <div>
      ************** FieldEntryForm **************
      {/* below conditional method selection rendering for http/s */}
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

      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default RestMethodAndEndpointEntryForm;
