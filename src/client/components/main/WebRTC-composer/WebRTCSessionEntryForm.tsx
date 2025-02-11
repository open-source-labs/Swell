import React, { useState } from 'react';
import { NewRequestWebRTCSet, RequestWebRTC, ReqRes } from '../../../../types';
import webrtcPeerController from '../../../controllers/webrtcPeerController';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../toolkit-refactor/hooks';
import { newRequestWebRTCSet } from '../../../toolkit-refactor/slices/newRequestSlice';
import { RootState } from '../../../toolkit-refactor/store';

interface Props {
  setShowRTCEntryForms: (val: boolean) => any;
}

const WebRTCSessionEntryForm: React.FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch();
  const newRequestWebRTC: RequestWebRTC = useAppSelector(
    (store: RootState) => store.newRequest.newRequestWebRTC
  );
  const currentReqRes = useAppSelector(
    (store: RootState) => store.reqRes.currentResponse
  ) as ReqRes;

  const isDark = useAppSelector(
    (store: { ui: { isDark: boolean } }) => store.ui.isDark
  );

  const { setShowRTCEntryForms } = props;
  const [entryTypeDropdownIsActive, setEntryTypeDropdownIsActive] =
    useState(false);
  const [dataTypeDropdownIsActive, setDataTypeDropdownIsActive] =
    useState(false);

  // may have to have a connect button for peer 1 and a different one for peer 2
  // this is because peer 2 does not need to create a data channel, rather they receive one from peer 1

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
                  dispatch(
                    newRequestWebRTCSet({
                      ...newRequestWebRTC,
                      webRTCEntryMode: 'Manual',
                    })
                  );
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
                  dispatch(
                    newRequestWebRTCSet({
                      ...newRequestWebRTC,
                      webRTCEntryMode: 'WS',
                    })
                  );
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
          className={`${
            isDark ? 'dark-address-input' : ''
          } ml-1 input input-is-medium is-info`}
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
            id="input-method"
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
              console.log('newRequestWebRTCFromConnect:', {
                newRequestWebRTC: newRequestWebRTC,
              });
              webrtcPeerController.createPeerConnection(
                newRequestWebRTC,
                currentReqRes
              );
            }}
          >
            Connect
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {/* AUDIO RTC Channel is Work-In-Progress */}
            {newRequestWebRTC.webRTCDataChannel !== 'Audio' && (
              <li>
                <a
                  onClick={() => {
                    dispatch(
                      newRequestWebRTCSet({
                        ...newRequestWebRTC,
                        webRTCDataChannel: 'Audio',
                      } as RequestWebRTC)
                    );
                    setShowRTCEntryForms(false);
                    setDataTypeDropdownIsActive(false);
                  }}
                  className="dropdown-item"
                >
                  Audio
                </a>
              </li>
            )}
            {newRequestWebRTC.webRTCDataChannel !== 'Video' && (
              <li>
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
              </li>
            )}
            {newRequestWebRTC.webRTCDataChannel !== 'Text' && (
              <a
                onClick={() => {
                  dispatch(
                    newRequestWebRTCSet({
                      ...newRequestWebRTC,
                      webRTCDataChannel: 'Text',
                    } as RequestWebRTC)
                  );
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
