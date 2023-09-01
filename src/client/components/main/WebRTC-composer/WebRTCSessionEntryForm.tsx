import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../rtk/store';
import { newRequestWebRTCSet } from '../../../rtk/slices/newRequestSlice';
import useDropdownState from '~/hooks/useDropdownState';

import { type NewRequestWebRTCSet, type RequestWebRTC } from '~/types';
import webrtcPeerController from '~/controllers/webrtcPeerController';
import dropDownArrow from '~/assets/icons/arrow_drop_down_white_192x192.png';

interface Props {
  setShowRTCEntryForms: (val: boolean) => void;
}

const WebRTCSessionEntryForm: React.FC<Props> = ({ setShowRTCEntryForms }) => {
  const dispatch = useAppDispatch();
  const newRequestWebRTC = useAppSelector(
    (store) => store.newRequest.newRequestWebRTC
  );

  /**
   * @todo 2023-08-31 - This seems like a huge code smell. I think that one of
   * the later iterators on the project tried building the dropdowns from
   * scratch, without realizing that there was already code in place in a few
   * other places for doing that.
   *
   * Ended up using the useDropdownState hook to clean up the implementations,
   * but several properties from the hook still aren't being used, even though
   * they may still need to be.
   */
  const entryDropdownState = useDropdownState();
  const dataDropdownState = useDropdownState();

  return (
    <div>
      <div
        className={` is-flex is-justify-content-center dropdown ${
          entryDropdownState.dropdownIsOpen && 'is-active'
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            id="rest-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={entryDropdownState.toggleDropdown}
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
                  entryDropdownState.closeDropdown();
                  dispatch(
                    newRequestWebRTCSet({
                      ...newRequestWebRTC,
                      webRTCEntryMode: 'Manual',
                    })
                  );
                }}
                className="dropdown-item"
              >
                Manual
              </a>
            )}

            {newRequestWebRTC.webRTCEntryMode !== 'WS' && (
              <a
                onClick={() => {
                  entryDropdownState.closeDropdown();
                  dispatch(
                    newRequestWebRTCSet({
                      ...newRequestWebRTC,
                      webRTCEntryMode: 'WS',
                    })
                  );
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
          dataDropdownState.dropdownIsOpen && 'is-active'
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            id="input-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={dataDropdownState.toggleDropdown}
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
                  dataDropdownState.closeDropdown();
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
                  dataDropdownState.closeDropdown();
                }}
                className="dropdown-item"
              >
                Video
              </a>
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
                  dataDropdownState.closeDropdown();
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
