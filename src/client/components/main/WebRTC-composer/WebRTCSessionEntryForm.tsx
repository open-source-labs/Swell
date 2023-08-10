import React, { useState, useRef } from 'react';
import { NewRequestWebRTCSet, RequestWebRTC } from '../../../../types';
import webrtcPeerController from '../../../controllers/webrtcPeerController';

import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';

interface Props {
  newRequestWebRTC: RequestWebRTC;
  newRequestWebRTCSet: NewRequestWebRTCSet;
  setPeerConnectionOn: (val: boolean) => any;
  warningMessage: { uri: string };
}

const WebRTCSessionEntryForm: React.FC<Props> = (props: Props) => {
  const { newRequestWebRTC, newRequestWebRTCSet, setPeerConnectionOn } = props;
  const [entryTypeDropdownStatus, setEntryTypeDropdownStatus] = useState(false);
  const [dataTypeDropdownIsActive, setDataTypeDropdownIsActive] =
    useState(false);

  return (
    <div>
      <div
        className={` is-flex is-justify-content-center dropdown ${
          entryTypeDropdownStatus ? 'is-active' : ''
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            id="rest-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => setEntryTypeDropdownStatus(!entryTypeDropdownStatus)}
          >
            <span>{newRequestWebRTC.webRTCEntryMode}</span>
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
            {newRequestWebRTC.webRTCEntryMode !== 'Manual' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCEntryMode: 'Manual',
                  });
                  setEntryTypeDropdownStatus(false);
                }}
                className="dropdown-item"
              >
                Manual
              </a>
            )}

            {newRequestWebRTC.webRTCEntryMode !== 'WS' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCEntryMode: 'WS',
                  });
                  setEntryTypeDropdownStatus(false);
                }}
                className="dropdown-item"
              >
                WS
              </a>
            )}
          </ul>
        </div>
        <input
          className="ml-1 input input-is-medium is-info"
          type="text"
          placeholder={
            newRequestWebRTC.webRTCEntryMode === 'Manual'
              ? 'No Server Required'
              : 'Enter WS Server'
          }
          disabled={newRequestWebRTC.webRTCEntryMode === 'Manual' && true}
        />
      </div>
      <div
        className={` is-flex dropdown ${
          dataTypeDropdownIsActive ? 'is-active' : ''
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            id="rest-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => {
              setDataTypeDropdownIsActive(!dataTypeDropdownIsActive);
            }}
          >
            <span>{newRequestWebRTC.webRTCDataChannel}</span>
            <span className="icon is-medium">
              <img
                src={dropDownArrow}
                className="arrow-drop-down is-awesome-icon"
                aria-hidden="true"
                alt="dropdown arrow"
              />
            </span>
          </button>
          <button
            className="ml-1 is-rest button no-border-please"
            onClick={() => {
              setPeerConnectionOn(true);
              webrtcPeerController.createPeerConnection(newRequestWebRTC);
            }}
          >
            Connect
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {newRequestWebRTC.webRTCDataChannel !== 'Audio' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Audio',
                  });
                  setPeerConnectionOn(false);
                  setDataTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Audio
              </a>
            )}
            {newRequestWebRTC.webRTCDataChannel !== 'Video' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Video',
                  });
                  setPeerConnectionOn(false);
                  setDataTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Video
              </a>
            )}
            {newRequestWebRTC.webRTCDataChannel !== 'Text' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Text',
                  });
                  setPeerConnectionOn(false);
                  setDataTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Text
              </a>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebRTCSessionEntryForm;
