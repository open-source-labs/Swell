
import React from "react";
import connectionController from "../../controllers/reqResController";
import OpenBtn from "../display/OpenBtn.jsx";
import CloseBtn from "../display/CloseBtn.jsx";
import RequestTabs from "../display/RequestTabs.jsx";
import ResponseContainer from "./ResponseContainer.jsx";
import WebSocketWindow from "../display/WebSocketWindow";
import dropDownArrow from "../../../assets/icons/arrow_drop_down_white_192x192.png";

const SingleReqResContainer = (props) => {

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

  // checked and minimized probably shouldn't be in state,
  // buuut they currently have many dependecies so leaving this way for now
  let { checked, minimized } = content;

  const onCheckHandler = () => {
    checked = !checked;
    reqResUpdate(content);
  }

  const removeReqRes = () => {
    connectionController.closeReqRes(id);
    reqResDelete(content);
  }

  const minimize = () => {
    minimized = !minimized;
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
  if (/wss?:\/\//.test(protocol) && !graphQL) {
    contentBody.push(
      <WebSocketWindow
        key={0}
        outgoingMessages={request.messages}
        incomingMessages={response.messages}
        id={id}
        connection={connection}
      />
    );
  } else {
    contentBody.push(
      <RequestTabs requestContent={request} key={0} />
    );
    if (connection !== "uninitialized") {
      contentBody.push(
        <ResponseContainer
          content={content}
          connectionType={connectionType}
          reqResUpdate={reqResUpdate}
          key={1}
        />
      );
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
  const arrowClass = !minimized
    ? "composer_subtitle_arrow-open"
    : "composer_subtitle_arrow-closed";
  
  return (
    <div>
      <div className="resreq_wrap" id={id}>
        <div className="title-row">
          <span
            className="primary-title highlighter title_reverse-offset"
            onClick={minimize}
          >
            <span>
              <img className={arrowClass} src={dropDownArrow} alt=""/>
            </span>
            <pre>
              <p> </p>
            </pre>
            {request.method}
          </span>
          <span className="primary-title ">{url}</span>
        </div>
        {
          //----------------------------------------
          //Contitionally minimize the current reqRescontainer
          //----------------------------------------
          !minimized && (
            <>
              <div className="grid-7">
                <div>
                  <input
                    id={id}
                    checked={checked}
                    className="reqres_select-radio"
                    name="resreq-select"
                    type="checkbox"
                    onChange={onCheckHandler}
                  />
                </div>

                <div className="btn-sm">
                  <OpenBtn
                    stylesObj={openButtonStyles}
                    content={content}
                    connectionStatus={connection}
                    reqResUpdate={reqResUpdate}
                  />
                  <CloseBtn
                    stylesObj={closeButtonStyles}
                    content={content}
                    connectionStatus={connection}
                  />
                </div>

                <div className="btn-sm">
                  <button
                    type="button"
                    className="btn resreq_remove"
                    onClick={removeReqRes}
                  >
                    Remove
                  </button>
                </div>

                <div>{statusLight}</div>
                
                <span className="tertiary-title">
                  {connectionType}
                </span>

                {request.method === "SUBSCRIPTION" ||
                /wss?:\/\//.test(protocol) ||
                connectionType === "SSE" ? (
                  <></>
                ) : (
                  <span
                    className="tertiary-title roundtrip"
                    title="The amount of time it takes to receive response"
                  >
                    Roundtrip:{" "}
                    {connection === "open" ||
                    connection === "pending" ||
                    timeReceived === null
                      ? 0
                      : timeReceived -
                        timeSent}{" "}
                    ms
                  </span>
                )}

                <div className="tertiary-title">
                  {renderStatusCode()}
                </div>
              </div>
              <div style={http2Display} className="httptwo">
                HTTP2 connection: Requests with the same host will share a
                single HTTP2 connection
              </div>
              {connection === "error" && (
                <div className="networkerror">
                  There was a network error in connecting to endpoint
                </div>
              )}
              {contentBody}
            </>
          )
        }
      </div>
    </div>
  );
}

export default SingleReqResContainer;
