/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';

const WebRTCSessionEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
}) => {
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

  const urlChangeHandler = (e) => {
    warningCheck();
    const url = e.target.value;
    setNewRequestFields({
      ...newRequestFields,
      webrtcUrl: url,
      url,
    });
  };

  const methodChangeHandler = (value) => {
    warningCheck();
    let newBody;
    setNewRequestFields({
      ...newRequestFields,
      method: value,
      bodyContent: newBody,
      bodyIsNew: false,
    });
  };

  return (
    <div>
      <div
        ref={dropdownEl}
        className={`ml-2 mr-2 is-flex is-justify-content-center dropdown ${
          dropdownIsActive ? 'is-active' : ''
        }`}
      >
        <div className="dropdown-trigger">
          <button
            className="button is-webrtc"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => setDropdownIsActive(!dropdownIsActive)}
          >
            <span>{newRequestFields.method}</span>
            <span className="icon is-small">
              <img
                src={dropDownArrow}
                className="is-awesome-icon"
                aria-hidden="true"
                alt="dropdown"
              />
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {newRequestFields.method !== 'INITIATOR' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('INITIATOR');
                }}
                className="dropdown-item"
              >
                INITIATOR
              </a>
            )}
            {newRequestFields.method !== 'RECEIVER' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('RECEIVER');
                }}
                className="dropdown-item"
              >
                RECEIVER
              </a>
            )}
          </ul>
        </div>

        <input
          className="ml-1 input input-is-medium is-info"
          type="text"
          placeholder="Enter endpoint"
          value={newRequestFields.webrtcUrl}
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

export default WebRTCSessionEntryForm;
