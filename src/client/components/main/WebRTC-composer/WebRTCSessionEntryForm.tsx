import React, { useState, useRef } from 'react';
import {
  $TSFixMe,
  NewRequestFields,
  NewRequestWebRTCSet,
  RequestWebRTC,
} from '../../../../types';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';

interface Props {
  fieldsReplaced: $TSFixMe;
  newRequestWebRTC: RequestWebRTC;
  newRequestFields: NewRequestFields;
  warningMessage: { uri: string };
  newRequestWebRTCSet: NewRequestWebRTCSet;
}

const WebRTCSessionEntryForm: React.FC<Props> = (props: Props) => {
  const { newRequestWebRTC, newRequestWebRTCSet } = props;
  const [entryTypeDropdownStatus, setEntryTypeDropdownStatus] = useState(false);

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
          placeholder={newRequestWebRTC.webRTCEntryMode === 'Manual' ? 'No Server Required' : 'Enter WS Server'}
          disabled={newRequestWebRTC.webRTCEntryMode === 'Manual' && true}
        />
      </div>
      {/* <div>
        <button
          id="webRTButton"
          className="no-border-please button is-webrtc"
          style={{ width: '5vw' }}
        >
          Manual
        </button>
      </div>
      <input
        className="ml-1 input input-is-medium is-info"
        type="text"
        placeholder="Enter WS Server"
      /> */}
    </div>
  );
};

export default WebRTCSessionEntryForm;

// import React from 'react';

// const WebRTCSessionEntryForm = ({ warningMessage }) => {
//   return (
//     <div className="is-flex is-justify-content-center"
//     style={{padding: '10px'}}>
//       <div id="webRTButton" className="no-border-please button is-webrtc">
//         <span>SDP</span>
//       </div>
//       <input
//         className="ml-1 input input-is-medium is-info"
//         type="text"
//         placeholder="No url needed"
//         disabled
//       />
//       {warningMessage.uri && (
//         <div className="warningMessage">{warningMessage.uri}</div>
//       )}
//     </div>
//   );
// };

// export default WebRTCSessionEntryForm;
