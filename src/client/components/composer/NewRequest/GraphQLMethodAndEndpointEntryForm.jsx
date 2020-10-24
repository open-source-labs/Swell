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
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  const warningCheck = () => {
    if (warningMessage.uri) {
      const newWarningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setComposerWarningMessage({ ...newWarningMessage });
    }
  }
  
  const urlChangeHandler = (e) => {
    warningCheck();
    const url = e.target.value;

    setNewRequestFields({
      ...newRequestFields,
      gqlUrl: url,
      url,
    });
  }

  const methodChangeHandler = (value) => {
    warningCheck();

    let newBody;
    const methodReplaceRegex = new RegExp(
      `${newRequestFields.method}`,
      "mi"
    );
      // GraphQL features
    if (value === "QUERY") {
      if (!newRequestFields.graphQL){
        newBody = `query {

}`;
      }
      else {
        newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
          ? newRequestBody.bodyContent.replace(methodReplaceRegex, "query")
          : `query ${newRequestBody.bodyContent}`;
      }
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
  
    setNewRequestFields({
      ...newRequestFields,
      method: value,
      protocol: value === "SUBSCRIPTION" ? "ws://" : "",
    });  
  }

  return (
    <div>
      <div className={`ml-2 mr-2 is-flex is-justify-content-center dropdown ${dropdownIsActive ? 'is-active' : ''}`}>
    
          <div className="dropdown-trigger">
            <button id="graphQLMethodButton" className="button is-primary-100" aria-haspopup="true" aria-controls="dropdown-menu"
              onClick={() => setDropdownIsActive(!dropdownIsActive)}
            >
              <span>{newRequestFields.method}</span>
              <span className="icon is-small">
                <i className="fas fa-caret-down" aria-hidden="true" />
              </span>
            </button>
          </div>
  
          <div className="dropdown-menu" id="dropdown-menu">
            <ul className="dropdown-content">
              {newRequestFields.method !== 'QUERY' &&
                (<li 
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("QUERY");
                  }} 
                  className="dropdown-item" 
                >QUERY</li>)
              }
              {newRequestFields.method !== 'MUTATION' &&
                (<li
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("MUTATION"); 
                  }} 
                  className="dropdown-item" 
                >MUTATION</li>)
              }
              {newRequestFields.method !== 'SUBSCRIPTION' &&
                (<li 
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("SUBSCRIPTION");
                  }} 
                  className="dropdown-item" 
                >SUBSCRIPTION</li>)
              }
            </ul>
          </div>
          
      
        <input
          className="ml-1 input input-is-medium is-info"
          type="text"
          placeholder="Enter endpoint"
          value={newRequestFields.gqlUrl}
          onChange={(e) => {
            urlChangeHandler(e);
          }}
        />
      </div>

      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};


export default GraphQLMethodAndEndpointEntryForm;
