import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../../../src/client/actions/actions.js";

import connectionController from "../../controllers/reqResController";
import RestRequestContent from "../display/RestRequestContent.jsx";
import GraphQLRequestContent from "../display/GraphQLRequestContent.jsx";
import GRPCRequestContent from "../display/GRPCRequestContent.jsx";
import ReqResCtrl from "../../controllers/reqResController";

const SingleReqResContainer = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

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
  
  return (
    <div className="m-3">
      {/* TITLE BAR */}
      <div className='is-flex cards-titlebar'>
        <div className={`is-flex-grow-1 is-${network} is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium`}>{request.method}</div>
        <div className={'is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center ml-2'}>{url}</div>
      </div>
      {/* VIEW REQUEST DETAILS / MINIMIZE */}
      {network !== 'ws' &&
        <div className='is-neutral-300 is-size-7 cards-dropdown minimize-card pl-2 is-flex is-align-items-center' 
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
            className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 bl-border-curve"
            id={request.method}
            onClick={removeReqRes}
            >
            Remove
          </button>
          {/* SEND BUTTON */}
            {connection === "uninitialized" &&
              <button
                className="is-flex-basis-0 is-flex-grow-1 button is-primary-100 is-size-7 br-border-curve"
                onClick={() => {
                  ReqResCtrl.openReqRes(content.id);
                }}
                >
                Send
              </button>
            }
            {/* VIEW RESPONSE BUTTON */}
            {connection !== "uninitialized" &&
              <button
                className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 br-border-curve"
                onClick={() => {
                  dispatch(actions.saveCurrentResponseData(content));
                }}
                >
                View Response
              </button>
            }
        </div>

    </div>
  );
}
export default SingleReqResContainer;
