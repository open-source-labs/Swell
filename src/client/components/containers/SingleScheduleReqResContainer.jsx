import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/actions.js";

import connectionController from "../../controllers/reqResController";
import RestRequestContent from "../display/RestRequestContent.jsx";
import GraphQLRequestContent from "../display/GraphQLRequestContent.jsx";
import GRPCRequestContent from "../display/GRPCRequestContent.jsx";
import ReqResCtrl from "../../controllers/reqResController";

const SingleScheduleReqResContainer = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [checker, setChecker] = useState(false);
  const dispatch = useDispatch();

  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );

  const newRequestFields = useSelector(
    (store) => store.business.newRequestFields
  );
  const newRequestStreams = useSelector(
    (store) => store.business.newRequestStreams
  );

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
    index,
  } = props;
  const network = content.request.network;
  const method = content.request.method;

  const removeReqRes = () => {
    connectionController.closeReqRes(content);
    reqResDelete(content);
  };

  const getBorderClass = () => {
    let classes = "highlighted-response ";
    if (currentResponse.gRPC) classes += "is-grpc-border";
    else if (currentResponse.graphQL) classes += "is-graphQL-border";
    else if (currentResponse.request.method === "WS") classes += "is-ws-border";
    else classes += "is-rest-border";
    return classes;
  };

  const highlightClasses =
    currentResponse.id === content.id ? getBorderClass(currentResponse) : "";

    //USE EFFECT

  return (
    <div className={`m-3 ${highlightClasses}`}>
      {/* TITLE BAR */}
      <div className="is-flex cards-titlebar">
        <div
          className={`is-flex-grow-1 is-${network} is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium`}
        >
          {request.method}
        </div>
        <div className="is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center is-justify-content-space-between">
          <div className="is-flex is-align-items-center ml-2">{url}</div>
          {/* RENDER STATUS */}
          <div className="req-status mr-1 is-flex is-align-items-center">
            {connection === "uninitialized" && (
              <div className="connection-uninitialized" />
            )}
            {connection === "error" && <div className="connection-error" />}
            {connection === "open" && <div className="connection-open" />}
            {connection === "closed" &&
              method != "WS" &&
              method !== "SUBSCRIPTION" && (
                <div className="connection-closed" />
              )}
            {connection === "closed" &&
              (method === "WS" || method === "SUBSCRIPTION") && (
                <div className="connection-closedsocket" />
              )}
          </div>
        </div>
      </div>
      {/* VIEW REQUEST DETAILS / MINIMIZE */}
      {network !== "ws" && (
        <div
          className="is-neutral-300 is-size-7 cards-dropdown minimize-card pl-3 is-flex is-align-items-center is-justify-content-space-between"
          onClick={() => {
            setShowDetails(showDetails = false);
          }}
        >
          {showDetails === true && "Hide Request Details"}
          {showDetails === false && "View Request Details"}
          {showDetails === true && (
            <div
              className="is-clickable is-primary-link mr-3"
              onClick={copyToComposer}
            >
              Copy to Composer
            </div>
          )}
        </div>
      )}
      {/* REQUEST ELEMENTS */}
      {showDetails === true && (
        <div className="is-neutral-200-box">
          {network === "rest" && (
            <RestRequestContent request={content.request} isHTTP2={isHTTP2}/>
          )}
          {network === "grpc" && (
            <GRPCRequestContent
              request={content.request}
              rpc={content.rpc}
              service={content.service}
            />
          )}
          {network === "graphQL" && (
            <GraphQLRequestContent request={content.request} />
          )}
        </div>
      )}
      {/* REMOVE / SEND BUTTONS */}
      <div className="is-flex">
        <button
          className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 bl-border-curve"
          id={request.method.split(' ').join('-')}
          onClick={() => {
            removeReqRes();
            dispatch(actions.saveCurrentResponseData({}));
          }}
        >
          Remove
        </button>


        {!(checker) && (
          <button
            className="is-flex-basis-0 is-flex-grow-1 button is-primary-100 is-size-7 br-border-curve"
            id={`send-button-${index}`}
            onClick={() => {
              ReqResCtrl.openReqRes(content.id);
              dispatch(actions.saveCurrentResponseData(content));
              setChecker(checker === false);
            }}
          >
            Send
          </button>
        )}
        {/* VIEW RESPONSE BUTTON */}
        {checker && (
          <button
            className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 br-border-curve"
            id={`view-button-${index}`}
            onClick={() => {
              dispatch(actions.saveCurrentResponseData(content));
            }}
          >
            View Response
          </button>
        )}
      </div>
    </div>
  );
};
export default SingleScheduleReqResContainer;
