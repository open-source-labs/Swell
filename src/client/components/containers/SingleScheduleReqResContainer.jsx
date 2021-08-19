/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions.js';
import RestRequestContent from '../display/RestRequestContent.jsx';
import GraphQLRequestContent from '../display/GraphQLRequestContent.jsx';
import GRPCRequestContent from '../display/GRPCRequestContent.jsx';

const SingleScheduleReqResContainer = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );

  const {
    content,
    content: { request, connection, isHTTP2, url },
    index,
    date,
  } = props;
  const network = content.request.network;
  const method = content.request.method;

  const getBorderClass = () => {
    let classes = 'highlighted-response ';
    if (currentResponse.gRPC) classes += 'is-grpc-border';
    else if (currentResponse.graphQL) classes += 'is-graphQL-border';
    else if (currentResponse.request.method === 'WS') classes += 'is-ws-border';
    else classes += 'is-rest-border';
    return classes;
  };

  const highlightClasses =
    currentResponse.id === content.id ? getBorderClass(currentResponse) : '';

  useEffect(() => {
    dispatch(
      actions.saveCurrentResponseData(
        content,
        'SingleScheduleReqResContainerComponent'
      )
    );
  }, [content, dispatch]);

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
            {connection === 'uninitialized' && (
              <div className="connection-uninitialized" />
            )}
            {connection === 'error' && <div className="connection-error" />}
            {connection === 'open' && <div className="connection-open" />}
            {connection === 'closed' &&
              method != 'WS' &&
              method !== 'SUBSCRIPTION' && (
                <div className="connection-closed" />
              )}
            {connection === 'closed' &&
              (method === 'WS' || method === 'SUBSCRIPTION') && (
                <div className="connection-closedsocket" />
              )}
          </div>
        </div>
      </div>
      {/* VIEW REQUEST DETAILS / MINIMIZE */}
      {network !== 'ws' && (
        <div
          className="is-neutral-300 is-size-7 cards-dropdown minimize-card pl-3 is-flex is-align-items-center is-justify-content-space-between"
          onClick={() => {
            setShowDetails((showDetails = false));
          }}
        >
          {date}
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
          {network === 'rest' && (
            <RestRequestContent request={content.request} isHTTP2={isHTTP2} />
          )}
          {network === 'grpc' && (
            <GRPCRequestContent
              request={content.request}
              rpc={content.rpc}
              service={content.service}
            />
          )}
          {network === 'graphQL' && (
            <GraphQLRequestContent request={content.request} />
          )}
        </div>
      )}
      {/* REMOVE / SEND BUTTONS */}
      <div className="is-flex">
        {true && (
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
