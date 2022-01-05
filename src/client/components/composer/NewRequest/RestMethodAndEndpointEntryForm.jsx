/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
// import ProtocolSelect from "./ProtocolSelect.jsx";

const RestMethodAndEndpointEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
  setNewRequestBody,
  newRequestBody,
  setNewTestContent,
}) => {
  const isDark = useSelector(state => state.ui.isDark);
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  const dropdownEl = useRef();
  
  useEffect(() => {
    const closeDropdown = (event) => {
      if (!dropdownEl.current.contains(event.target)) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);
  

  const warningCheck = () => {
    if (warningMessage.uri) {
      const newWarningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setComposerWarningMessage({ ...newWarningMessage });
    }
  };
  
  const methodChangeHandler = (newMethodStr) => {
    warningCheck();
    //if one of 5 http methods (get, post, put, patch, delete)
    setNewRequestBody({
      ...newRequestBody,
      bodyType: 'raw',
      bodyContent: '',
    });
    
    //always set new method
    setNewRequestFields({
      ...newRequestFields,
      method: newMethodStr,
      protocol: '',
    });
    
    setNewTestContent('');
  };
  
  const urlChangeHandler = (e, network) => {
    warningCheck();
    const url = e.target.value;
    setNewRequestFields({
      ...newRequestFields,
      restUrl: url,
      url,
    });
  };
  
  return (
    
    <div>
      <div
        ref={dropdownEl}
        className={` is-flex is-justify-content-center dropdown ${
          dropdownIsActive ? 'is-active' : ''
        }`}
        style={{padding: '10px'}}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => setDropdownIsActive(!dropdownIsActive)}
          >
            <span>{newRequestFields.method}</span>
            <span className="icon is-medium">
              <img
                src={dropDownArrow}
                className="arrow-drop-down is-awesome-icon"
                aria-hidden="true"
                alt="dropdown arrow"
              />
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {newRequestFields.method !== 'GET' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('GET');
                }}
                className="dropdown-item"
              >
                GET
              </a>
            )}

            {newRequestFields.method !== 'POST' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('POST');
                }}
                className="dropdown-item"
              >
                POST
              </a>
            )}
            {newRequestFields.method !== 'PUT' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('PUT');
                }}
                className="dropdown-item"
              >
                PUT
              </a>
            )}
            {newRequestFields.method !== 'PATCH' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('PATCH');
                }}
                className="dropdown-item"
              >
                PATCH
              </a>
            )}
            {newRequestFields.method !== 'DELETE' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('DELETE');
                }}
                className="dropdown-item"
              >
                DELETE
              </a>
            )}
          </ul>
        </div>

        <input
          className={`${isDark ? 'dark-address-input' : ''} ml-1 input input-is-medium is-info`}
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
