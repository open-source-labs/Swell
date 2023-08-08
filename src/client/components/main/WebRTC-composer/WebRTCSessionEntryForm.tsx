import React from 'react';

interface Props {
  warningMessage: { uri: string };
}

const WebRTCSessionEntryForm: React.FC<Props> = ({ warningMessage }) => {
  return (

    <>
      <div className="is-flex is-justify-content-center" style={{ padding: '10px' }}>
      <div>
       <button id="webRTButton" className="no-border-please button is-webrtc" style={{ width : "5vw" }}>WS</button>

      </div>
        <input
          className="ml-1 input input-is-medium is-info"
          type="text"
          placeholder="Enter WS Server"
        />
      </div>

      {/* <button id="webRTButton"  className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"style={{ marginLeft : "40vw" }}>add to wkspce</button> */}
     {/* </div> */}
      {/* {warningMessage.uri && <div className="warningMessage">{warningMessage.uri}</div>} */}
    </>
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
