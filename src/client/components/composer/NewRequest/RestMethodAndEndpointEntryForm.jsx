/* eslint-disable */

import React, { useState, useRef } from "react";
// import ProtocolSelect from "./ProtocolSelect.jsx";

const RestMethodAndEndpointEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
  setNewRequestBody,
  newRequestBody,
}) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  
  const methodChangeHandler = (newMethodStr) => {
    //if one of 5 http methods (get, post, put, patch, delete)
    setNewRequestBody({
      ...newRequestBody,
      bodyType: "raw",
      bodyContent: "",
    });
    
    //always set new method
    setNewRequestFields({
      ...newRequestFields,
      method: newMethodStr,
      protocol: '',
    });
  } 

  const urlChangeHandler = (e, network) => {
    const url = e.target.value;

    if (warningMessage.uri) {
      const warningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setComposerWarningMessage({ ...warningMessage });
    }

    setNewRequestFields({
      ...newRequestFields,
      restUrl: url,
      url,
    }); 
  };
  
  

  return (
    <div>
      {/* ************** RestMethodAndEndpointEntryForm ************** */}
        <div className={`ml-2 mr-2 is-flex is-justify-content-center dropdown ${dropdownIsActive ? 'is-active' : ''}`}>
    
          <div className="dropdown-trigger">
            <button id="restMethodButton" className="button is-primary-100" aria-haspopup="true" aria-controls="dropdown-menu"
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
              {newRequestFields.method !== 'GET' &&
                (<li 
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("GET");
                  }} 
                  className="dropdown-item" 
                >GET</li>)
              }
              {newRequestFields.method !== 'POST' &&
                (<li
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("POST"); 
                  }} 
                  className="dropdown-item" 
                >POST</li>)
              }
              {newRequestFields.method !== 'PUT' &&
                (<li 
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("PUT");
                  }} 
                  className="dropdown-item" 
                >PUT</li>)
              }
              {newRequestFields.method !== 'PATCH' &&
                (<li  
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("PATCH")
                  }} 
                  className="dropdown-item" 
                >PATCH</li>)
              }
              {newRequestFields.method !== 'DELETE' &&
                (<li  
                  onClick={() => {
                    setDropdownIsActive(false);
                    methodChangeHandler("DELETE")
                  }} 
                  className="dropdown-item" 
                >DELETE</li>)
              }
            </ul>
          </div>
  
      
        <input
          className="ml-1 input input-is-medium is-info"
          type="text"
          placeholder="Enter endpoint"
          value={newRequestFields.restUrl}
          onChange={(e) => {
            urlChangeHandler(e, newRequestFields.network);
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
