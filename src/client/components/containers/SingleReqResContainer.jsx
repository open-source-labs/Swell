import React, { useState } from "react";
import connectionController from "../../controllers/reqResController";
import RequestTabs from "../display/RequestTabs.jsx";
import RestRequestContent from "../display/RestRequestContent.jsx";
import GraphQLRequestContent from "../display/GraphQLRequestContent.jsx";
import GRPCRequestContent from "../display/GRPCRequestContent.jsx";
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
      rpc,
      service,
    },
    reqResUpdate,
    reqResDelete,
  } = props;
  const network = content.request.network;

  const removeReqRes = () => {
    connectionController.closeReqRes(id);
    reqResDelete(content);
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
  
  return (
    <div className="m-3">
      {/* TITLE BAR */}
      <div className='is-flex cards-titlebar'>
        <div className={`is-flex-grow-1 is-${network}`}>{request.method}</div>
        <div className={'is-flex-grow-3 is-size-7'}>{url}</div>
      </div>
      {/* VIEW REQUEST DETAILS / MINIMIZE */}
      {network !== 'ws' &&
        <div className='is-neutral-300 is-size-7 cards-dropdown minimize-card' 
          onClick={() => { setShowDetails(showDetails === false)}}
          >
          View Request Details
        </div>
      }
      {/* REQUEST ELEMENTS */}
      {showDetails === true &&
        <div className='is-neutral-200-box'>
          {network === 'rest' &&
            <RestRequestContent request={content.request}/>
          }
          {network === 'grpc' &&
            <GRPCRequestContent request={content.request} rpc={content.rpc} service={content.service}/>
          }
          {network === 'graphQL' &&
            <GraphQLRequestContent request={content.request}/>
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
          {/* SEND BUTTON */}
            {connection === "uninitialized" &&
              <button
                className="is-flex-basis-0 is-flex-grow-1 button is-primary-100 is-size-7"
                onClick={() => ReqResCtrl.openReqRes(content.id)}
                >
                Send
              </button>
            }
            {/* VIEW RESPONSE BUTTON */}
            {connection !== "uninitialized" &&
              <button
                className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7"
                onClick={() => ReqResCtrl.openReqRes(content.id)}
                >
                View Response
              </button>
            }
        </div>

    </div>
  );
}
export default SingleReqResContainer;
