import React from 'react';
import uuid from 'uuid/v4';
import historyController from '../../controllers/historyController';

const WebhookContainer = (props) => {
  //button to generate URL
  //button to start sever
  //figure out how to listen to the webhook
  return (
    <div>
      <button className="button is-wh">Start/Close Server</button>
      <button className="button is-wh">Generate URL</button>
      hi JACOB!!!                           
      Yes Jen, suck on that 8============D  
      Show me  u   r toes                   
     </div>
  )
}

export default WebhookContainer;
// import React from 'react';
// import uuid from 'uuid/v4';
// import historyController from '../../controllers/historyController';
// import HeaderEntryForm from './NewRequest/HeaderEntryForm';
// import BodyEntryForm from './NewRequest/BodyEntryForm.jsx';
// import TestEntryForm from './NewRequest/TestEntryForm.jsx';
// import CookieEntryForm from './NewRequest/CookieEntryForm.jsx';
// import RestMethodAndEndpointEntryForm from './NewRequest/RestMethodAndEndpointEntryForm.jsx';
// import NewRequestButton from './NewRequest/NewRequestButton.jsx';

// function WebHookContainer({
//     resetComposerFields,
//     setNewRequestFields,
//     newRequestFields,
//     newRequestFields: {
//       gRPC,
//       url,
//       method,
//       graphQL,
//       restUrl,
//       wsUrl,
//       webrtc,
//       gqlUrl,
//       grpcUrl,
//       network,
//       testContent,
//     },
//     setNewRequestBody,
//     setNewTestContent,
//     newRequestBody,
//     newRequestBody: {
//       JSONFormatted,
//       rawType,
//       bodyContent,
//       bodyVariables,
//       bodyType,
//     },
//     setNewRequestHeaders,
//     newRequestHeaders,
//     newRequestHeaders: { headersArr },
//     setNewRequestCookies,
//     newRequestCookies,
//     newRequestCookies: { cookiesArr },
//     setNewRequestStreams,
//     newRequestStreams,
//     newRequestStreams: { protoPath },
//     setNewRequestSSE,
//     newRequestSSE: { isSSE },
//     currentTab,
//     introspectionData,
//     setComposerWarningMessage,
//     setComposerDisplay,
//     warningMessage,
//     reqResAdd,
//     setWorkspaceActiveTab,
//   }) {
//     const requestValidationCheck = () => {
//       const validationMessage = {};
//       //Error conditions...
//       if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
//         //if url is only http/https/ws/wss://
//         validationMessage.uri = 'Enter a valid URI';
//       }
//       if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
//         //if url doesn't have http/https/ws/wss://
//         validationMessage.uri = 'Enter a valid URI';
//       }
//       if (!JSONFormatted && rawType === 'application/json') {
//         validationMessage.json = 'Please fix JSON body formatting errors';
//       }
//       return validationMessage;
//     };
