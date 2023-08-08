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
    <div className="dropdown">
      <button className="button is-normal is-primary-100 add-request-button  no-border-please dropbtn"style={{ width : "12vw", marginLeft : "3vw", marginBottom : "5px"}}>SPECIFY CHANNEL</button>
      <div className="dropdown-content">
        <a href="#">Video</a>
        <a href="#">Audio</a>
        <a href="#">Text</a>
      </div>
    </div>
      <input
        className="ml-1 input input-is-medium is-info"
        type="text"
        placeholder="TEXT AREA"
       />
     <div>
      <button  className="button is-normal is-primary-100 add-request-button  no-border-please"style={{ width : "6vw", marginLeft : "3vw", marginTop : "5px", marginBottom : "5px" }}>get offer</button>
     </div>
     <div>
     <input
        className="ml-1 input input-is-medium is-info"
        type="text"
        placeholder="TEXT AREA"
       />
     </div>
     <div>
      <button id="webRTButton" className="button is-normal is-primary-100 add-request-button  no-border-please"style={{ width : "6vw", marginLeft : "3vw", marginTop : "5px" }}>get   answer</button>
      {/* <button id="webRTButton"  className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"style={{ marginLeft : "40vw" }}>add to wkspce</button> */}
     </div>
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
