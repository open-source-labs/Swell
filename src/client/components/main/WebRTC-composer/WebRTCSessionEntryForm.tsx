import React from 'react';
import { $TSFixMe, NewRequestFields } from '../../../../types';

interface Props {
  fieldsReplaced: $TSFixMe
  newRequestFields: NewRequestFields;
  warningMessage: { uri: string };
}

const WebRTCSessionEntryForm: React.FC<Props> = (props) => {
  return (
    <div
      className="is-flex is-justify-content-center"
      style={{ padding: '10px' }}
    >
      <div id="webRTButton" className="no-border-please button is-webrtc">
        <span>SDP</span>
      </div>
      <input
        className="ml-1 input input-is-medium is-info"
        type="text"
        placeholder="No url needed"
        // disabled
      />
      {props.warningMessage.uri && (
        <div className="warningMessage">{props.warningMessage.uri}</div>
      )}
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
