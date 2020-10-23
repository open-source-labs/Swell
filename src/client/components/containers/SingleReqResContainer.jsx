import React, { useState } from "react";
import connectionController from "../../controllers/reqResController";
import RequestTabs from "../display/RequestTabs.jsx";
import RestRequestContent from "../display/RestRequestContent.jsx";
import WebSocketWindow from "../display/WebSocketWindow";
import ReqResCtrl from "../../controllers/reqResController";

const SingleReqResContainer = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    content,
    content: {
      id,
      graphQL,
      closeCode,
      protocol,
      request,
      response,
      connection,
      connectionType,
      isHTTP2,
      url,
      timeReceived,
      timeSent,
    },
    reqResUpdate,
    reqResDelete,
  } = props;
  const network = content.request.network;

// content.minimized and content.checked are not destructured.
// There is an issue with destructuring them from content, updating them, and passing
// the new content in reqResUpdate

  const onCheckHandler = () => {
    content.checked = !content.checked;
    reqResUpdate(content);
  }

  const removeReqRes = () => {
    connectionController.closeReqRes(id);
    reqResDelete(content);
  }

  const minimize = () => {
    content.minimized = !content.minimized;
    reqResUpdate(content);
  }

  const renderStatusCode = () => {
    const { events, headers } = response;
    // graphQL
    if (graphQL) {
      if (!events || !events.length) {
        return '';
      } if (events && events.length) {
        const statusCode = JSON.parse(events[0]).statusCode;
        if (statusCode) return `Status: ${statusCode}`;
        return 'Status: 200';
      }
    }
    if (/wss?:\/\//.test(protocol)) {
      // ws - close codes
      return closeCode
        ? `Close Code: ${closeCode}`
        : "";
    } 
    // http
    return headers &&
      headers[":status"]
      ? "Status: " + headers[":status"]
      : "";
  }

  const contentBody = [];

  // WEBSOCKETS:
  if(network === 'ws') {
    // TREAT WEBSOCKETS
    // INSERT CODE HERE
  } else {
    // GRAPHQL, GRPC, REST:
    contentBody.push(
      <RequestTabs requestContent={request} key={0} />
    );
    if (connection !== "uninitialized") {
      // IF NOT SENT, BUTTON NEEDS TO READ SEND
    }
  }

  const openButtonStyles = {
    display:
      connection === "uninitialized" ||
      connection === "closed" ||
      connection === "error"
        ? "block"
        : "none",
  };

  const closeButtonStyles = {
    display:
      connection === "pending" ||
      connection === "open"
        ? "block"
        : "none",
  };

  const http2Display = {
    display: isHTTP2 ? "block" : "none",
  };

  let statusLight;
  switch (connection) {
    case "uninitialized":
      statusLight = <status-indicator />;
      break;
    case "pending":
      statusLight = <status-indicator intermediary pulse />;
      break;
    case "open":
      statusLight = <status-indicator positive pulse />;
      break;
    case "closed":
      statusLight = <status-indicator negative />;
      break;
    case "error":
      statusLight = <status-indicator negative />;
      break;
    default:
      console.log("not a valid connection for content object");
  }

  // TODO: remove later
  const arrowClass = !content.minimized
    ? "composer_subtitle_arrow-open"
    : "composer_subtitle_arrow-closed";
  
  return (
    <div className="m-3">
      {/* TITLE BAR */}
      <div className='is-flex cards-titlebar'>
        <div className={`is-flex-grow-1 is-${network}`}>{request.method}</div>
        <div className={'is-flex-grow-3 is-size-7'}>{url}</div>
      </div>
      {/* VIEW REQUEST DETAILS / MINIMIZE */}
      <div className='is-neutral-300 is-size-7 cards-dropdown minimize-card' 
        onClick={() => { setShowDetails(showDetails === false)}}
        >
        View Request Details
      </div>
      {/* REQUEST ELEMENTS */}
      {showDetails === true &&
        <div className='is-neutral-200-box'>
          {network === 'rest' &&
            <RestRequestContent request={content.request}/>
          }
        </div>
      }
      {/* REMOVE / SEND BUTTONS */}
      <div className="is-flex">
        <button 
          className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7"
          id={request.method}
          onClick={removeReqRes}
          >
          Remove
        </button>

        <button
          className="is-flex-basis-0 is-flex-grow-1 button is-primary-100 is-size-7"
          onClick={() => ReqResCtrl.openReqRes(content.id)}
          >
          Send
        </button>
      </div>

    </div>
  );
}
export default SingleReqResContainer;
