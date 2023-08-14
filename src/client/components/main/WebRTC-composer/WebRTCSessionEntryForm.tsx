import React, { useState } from 'react';
import { NewRequestWebRTCSet, RequestWebRTC } from '../../../../types';
import webrtcPeerController from '../../../controllers/webrtcPeerController';

import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import { useDispatch, useSelector } from 'react-redux';
import { newRequestWebRTCSet } from '../../../toolkit-refactor/slices/newRequestSlice';
import { RootState } from '../../../toolkit-refactor/store';

interface Props {
  setShowRTCEntryForms: (val: boolean) => any;
}

const WebRTCSessionEntryForm: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const newRequestWebRTC: RequestWebRTC = useSelector(
    (store: RootState) => store.newRequest.newRequestWebRTC
  );

  const { setShowRTCEntryForms } = props;
  const [entryTypeDropdownIsActive, setEntryTypeDropdownIsActive] =
    useState(false);
  const [dataTypeDropdownIsActive, setDataTypeDropdownIsActive] =
    useState(false);

  return (
    <div>
      <div
        className={` is-flex is-justify-content-center dropdown ${
          entryTypeDropdownIsActive && 'is-active'
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            id="rest-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() =>
              setEntryTypeDropdownIsActive(!entryTypeDropdownIsActive)
            }
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
                  dispatch(newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCEntryMode: 'Manual',
                  }));
                  setEntryTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Manual
              </a>
            )}

            {newRequestWebRTC.webRTCEntryMode !== 'WS' && (
              <a
                onClick={() => {
                  dispatch(newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCEntryMode: 'WS',
                  }));
                  setEntryTypeDropdownIsActive(false);
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
          disabled={newRequestWebRTC.webRTCEntryMode === 'Manual'}
        />
      </div>
      <div
        className={` is-flex dropdown ${
          dataTypeDropdownIsActive && 'is-active'
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
              setShowRTCEntryForms(true);
              webrtcPeerController.createPeerConnection(newRequestWebRTC);
            }}
          >
            Connect
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {/* AUDIO RTC Channel is Work-In-Progress */}
            {/* {newRequestWebRTC.webRTCDataChannel !== 'Audio' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Audio',
                  });
                  setShowRTCEntryForms(false);
                  setDataTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Audio
              </a>
            )} */}
            {newRequestWebRTC.webRTCDataChannel !== 'Video' && (
              <a
                onClick={() => {
                  dispatch(
                    newRequestWebRTCSet({
                      ...newRequestWebRTC,
                      webRTCDataChannel: 'Video',
                    } as RequestWebRTC)
                  );
                  setShowRTCEntryForms(false);
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
                  dispatch(newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Text',
                  } as RequestWebRTC));
                  setShowRTCEntryForms(false);
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
