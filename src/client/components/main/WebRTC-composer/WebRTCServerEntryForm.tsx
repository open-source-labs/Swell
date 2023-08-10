import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  $TSFixMe,
  NewRequestWebRTCSet,
  RequestWebRTC,
} from '../../../../types';
import TextCodeArea from '../sharedComponents/TextCodeArea';

// const jBeautify = require('js-beautify').js;

interface Props {
  newRequestWebRTC: RequestWebRTC;
  newRequestWebRTCSet: NewRequestWebRTCSet;
  createOffer: (newRequestWebRTC: RequestWebRTC) => void;
  createAnswer: (newRequestWebRTC: RequestWebRTC) => void;
  
  warningMessage: {
    body: string;
  } | null;
}

const WebRTCServerEntryForm: React.FC<Props> = (props: Props) => {
  let { newRequestWebRTC, newRequestWebRTCSet, createOffer, createAnswer } =
    props;
  let [dataTypeDropdownIsActive, setDataTypeDropdownIsActive] = useState(false);

  const requestBody = useSelector(
    (state: any) => state.newRequest.newRequestBody
  );

  const isDark = useSelector((state: any) => state.ui.isDark);

  return (
    <div className="mt-3">
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
            onClick={() =>
              setDataTypeDropdownIsActive(!dataTypeDropdownIsActive)
            }
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

      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCOffer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: value });
        }}
        placeholder={'Offer here'}
        readOnly={newRequestWebRTC.webRTCEntryMode === 'WS'}
      />
      <button
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={() => {
          createOffer(newRequestWebRTC);
        }}
      >
        Get Offer
      </button>
      {/* Code box for Answer */}
      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCAnswer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: value });
        }}
        placeholder={'Answer here'}
        readOnly={newRequestWebRTC.webRTCEntryMode === 'WS'}
      />
      <button
        id="webRTButton"
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={() => {
          createAnswer(newRequestWebRTC);
        }}
      >
        Get Answer
      </button>
      {/* {warningMessage ? <div>{warningMessage.body}</div> : null} */}
    </div>
  );
};

export default WebRTCServerEntryForm;