/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import EventsContainer from './EventsContainer';
import HeadersContainer from './HeadersContainer';
import TestsContainer from './TestsContainer';
import CookiesContainer from './CookiesContainer';
import StatusButtons from '../display/StatusButtons';
import ResponseTime from '../display/ResponseTime';
import WebSocketWindow from '../display/WebSocketWindow';
import ReqResCtrl from '../../controllers/reqResController';

const ResponsePaneContainer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((store) => store.ui.responsePaneActiveTab);

  const setActiveTab = (tabName) =>
    dispatch(actions.setResponsePaneActiveTab(tabName));

  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );
  const { connection } = currentResponse;

  // UNCOMMENT FOR DEBUGGING
  // console.log('currentResponse on ResponsePaneContainer --> ', currentResponse);

  return (
    <div
      className="column is-one-third is-flex is-flex-direction-column is-tall"
      id="responses"
    >
      {/* HEADER */}
      <div className="hero is-primary header-bar is-flex is-flex-direction-row is-justify-content-center">
        <ResponseTime currentResponse={currentResponse} />
        {currentResponse.responseSize && (
          <div className="response-size-placement">
            {`${currentResponse.responseSize}kb`}
          </div>
        )}
        <h3>Responses</h3>
        <StatusButtons currentResponse={currentResponse} />
      </div>
      <div className="is-flex is-flex-direction-column is-not-2-5-rem-tall">
        {/* TAB SELECTOR */}
        <div className="tabs header-bar">
          <ul className="columns is-gapless">
            {currentResponse.request?.network === 'ws' ? (
              <li
                className={`column ${
                  activeTab === 'wsWindow' ? 'is-active' : ''
                }`}
              >
                <a id="wsSendData" onClick={() => setActiveTab('wsWindow')}>
                  Send Data
                </a>
              </li>
            ) : (
              <li
                className={`column ${
                  activeTab === 'events' ? 'is-active' : ''
                }`}
              >
                <a onClick={() => setActiveTab('events')}> Events</a>
              </li>
            )}
            {/* IF NOT WEBSOCKETS */}
            {currentResponse.request?.network !== 'ws' && (
              <>
                <li
                  className={`column ${
                    activeTab === 'headers' ? 'is-active' : ''
                  }`}
                >
                  <a onClick={() => setActiveTab('headers')}>
                    {currentResponse.gRPC === true ? 'Metadata' : 'Headers'}
                  </a>
                </li>

                <li
                  className={`column ${
                    activeTab === 'cookies' ? 'is-active' : ''
                  }`}
                >
                  <a onClick={() => setActiveTab('cookies')}> Cookies</a>
                </li>
              </>
            )}
            <li
              className={`column ${activeTab === 'tests' ? 'is-active' : ''}`}
            >
              <a onClick={() => setActiveTab('tests')}> Tests</a>
            </li>
          </ul>
        </div>
        {/* RESPONSES CONTENT */}
        <div className="is-flex-grow-3 add-vertical-scroll is-flex is-flex-direction-column">
          {activeTab === 'events' && (
            <EventsContainer currentResponse={currentResponse} />
          )}
          {activeTab === 'headers' && (
            <HeadersContainer currentResponse={currentResponse} />
          )}
          {activeTab === 'cookies' && (
            <CookiesContainer currentResponse={currentResponse} />
          )}
          {activeTab === 'tests' && (
            <TestsContainer currentResponse={currentResponse} />
          )}
          {/* currentResponse.request?.network === "ws" */}
          {activeTab === 'wsWindow' &&
            currentResponse.request &&
            currentResponse.response &&
            currentResponse.request && (
              <WebSocketWindow
                key={0}
                outgoingMessages={currentResponse.request.messages}
                incomingMessages={currentResponse.response.messages}
                content={currentResponse}
                connection={currentResponse.connection}
              />
            )}
        </div>
        {/* RENDER RE-SEND REQUEST BUTTON ONLY FOR NOT WEB SOCKETS / SUBSCRIPTIONS */}
        {currentResponse.id &&
          currentResponse.request?.method !== 'WS' &&
          currentResponse.request?.method !== 'SUBSCRIPTION' &&
          (connection === 'closed' || connection === 'error') && (
            <div className="is-3rem-footer mx-3">
              <button
                className="button is-normal is-fullwidth is-primary-100 is-button-footer is-margin-top-auto add-request-button"
                onClick={() => {
                  ReqResCtrl.openReqRes(currentResponse.id);
                }}
                type="button"
              >
                Re-Send Request
              </button>
            </div>
          )}
      </div>
      {/* CLOSE RESPONSE BUTTON */}
      {(currentResponse.request?.method === 'WS' ||
        currentResponse.request?.method === 'SUBSCRIPTION' ||
        currentResponse.request?.isSSE ||
        currentResponse.isHTTP2) &&
        connection === 'open' && (
          <div className="is-3rem-footer ml-3 mr-3">
            <button
              className="button is-normal is-fullwidth is-primary-100 is-button-footer is-margin-top-auto add-request-button"
              onClick={() => {
                ReqResCtrl.closeReqRes(currentResponse);
              }}
              type="button"
            >
              Close Connection
            </button>
          </div>
        )}
      {/* RENDER RE-OPEN CONNECTION BUTTON ONLY FOR OPEN WEB SOCKETS / SUBSCRIPTIONS */}
      {(currentResponse.request?.method === 'WS' ||
        currentResponse.request?.method === 'SUBSCRIPTION') &&
        (connection === 'closed' || connection === 'error') && (
          <div className="is-3rem-footer mx-3">
            <button
              className="button is-normal is-fullwidth is-primary-100 is-button-footer is-margin-top-auto add-request-button"
              onClick={() => {
                ReqResCtrl.openReqRes(currentResponse.id);
              }}
              type="button"
            >
              Re-Open Connection
            </button>
          </div>
        )}
    </div>
  );
};

export default ResponsePaneContainer;
