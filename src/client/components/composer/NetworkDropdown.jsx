/* eslint-disable default-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect } from 'react';
import dropDownArrow from '../../../assets/icons/caret-down.svg';

function NetworkDropdown({ onProtocolSelect, network }) {
  const [dropdownIsActive, setDropdownIsActive] = useState();
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

  let networkTitle = '';

  switch (network) {
    case 'rest':
      networkTitle = 'REST';
      break;
    case 'graphQL':
      networkTitle = 'GRAPHQL';
      break;
    case 'grpc':
      networkTitle = 'gRPC';
      break;
    case 'ws':
      networkTitle = 'WEB SOCKETS';
      break;
    case 'webrtc':
      networkTitle = 'WebRTC';
      break;
    case 'openapi':
      networkTitle = 'OpenAPI';
      break;
  }

  return (
    <div
      ref={dropdownEl}
      className={`dropdown full-width is-fullwidth ${
        dropdownIsActive ? 'is-active' : ''
      }`}
    >
      <div className="dropdown-trigger full-width is-fullwidth">
        <div
          className="button protocol-select-button is-fullwidth columns is-gapless"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
        >
          <span className="column" id="selected-network">
            {networkTitle}
          </span>
          <span className="column">
            <img
              src={dropDownArrow}
              alt="dropdownArrow"
              className="is-awesome-icon"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      <div className="dropdown-menu full-width is-fullwidth">
        <div className="dropdown-content full-width is-fullwidth has-text-centered">
          <a
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect('rest');
            }}
            className="dropdown-item"
          >
            REST
          </a>
          <a
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect('graphQL');
            }}
            className="dropdown-item"
          >
            GRAPHQL
          </a>
          <a
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect('grpc');
            }}
            className="dropdown-item"
          >
            gRPC
          </a>
          <a
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect('ws');
            }}
            className="dropdown-item"
          >
            WEB SOCKETS
          </a>
          <a
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect('webrtc');
            }}
            className="dropdown-item"
          >
            WebRTC
          </a>
          <a
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect('openapi');
            }}
            className="dropdown-item"
          >
            OpenAPI
          </a>
        </div>
      </div>
    </div>
  );
}

export default NetworkDropdown;
