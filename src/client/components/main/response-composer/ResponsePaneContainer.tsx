/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import { Box } from '@mui/material';
import { setResponsePaneActiveTab } from '../../../toolkit-refactor/slices/uiSlice';
import { RootState } from '../../../toolkit-refactor/store';
import ReqResCtrl from '../../../controllers/reqResController';
import EventsContainer from './EventsContainer';
import HeadersContainer from './HeadersContainer';
import TestsContainer from './TestsContainer';
import CookiesContainer from './CookiesContainer';
import StatusButtons from './StatusButtons';
import ResponseTime from './ResponseTime';
import WebSocketWindow from './WebSocketWindow';
import State from '../../../toolkit-refactor/store';
import WebRTCVideoBox from '../WebRTC-composer/WebRTCVideoBox';
import WebRTCTextContainer from './webRTCResponseComponents/WebRTCTextContainer';

const ResponsePaneContainer: FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(
    (store: RootState) => store.ui.responsePaneActiveTab
  );
  const isDark = useAppSelector((store: RootState) => store.ui.isDark);

  const setActiveTab = (tabName: string) =>
    dispatch(setResponsePaneActiveTab(tabName));

  const currentResponse = useAppSelector(
    (store: RootState) => store.reqRes.currentResponse
  );
  const { id, connection, request, response, isHTTP2, gRPC } = currentResponse;

  return (
    <Box id="responses">
      <div
        className={`${
          isDark ? 'is-dark-400' : 'is-divider-neutral-300'
        } box is-3 add-vertical-scroll`}
        style={{
          height: '90%',
          margin: '0px',
          padding: '0.5rem 1rem 0.5rem 1rem',
        }}
      >
        {/* HEADER */}
        <div
          className="hero is-primary is-flex is-flex-direction-row is-justify-content-center"
          style={{ padding: '10px', position: 'sticky' }}
        >
          <ResponseTime currentResponse={currentResponse as any} />
          {response?.responseSize && (
            <div className="response-size-placement">
              {`${response?.responseSize}kb`}
            </div>
          )}
          <h3>Response</h3>
          <StatusButtons currentResponse={currentResponse as any} />
        </div>
        <div className="is-flex is-flex-direction-column is-not-2-5-rem-tall">
          {/* TAB SELECTOR */}
          <div className="tabs header-bar">
            <ul
              className={`columns is-gapless ${isDark ? 'dark-divider' : ''}`}
            >
              {request?.network === 'ws' && (
                <li
                  className={`column ${
                    activeTab === 'wsWindow' ? 'is-active' : ''
                  }`}
                >
                  <a id="wsSendData" onClick={() => setActiveTab('wsWindow')}>
                    Send Data
                  </a>
                </li>
              )}
              {request?.network === 'webrtc' && (
                <li
                  className={`column ${
                    activeTab === 'webrtc' ? 'is-active' : ''
                  }`}
                >
                  <a id="wsSendData" onClick={() => setActiveTab('webrtc')}>
                    WebRTC
                  </a>
                </li>
              )}
              {/* IF NOT WEBSOCKETS */}
              {request?.network !== ('ws' && 'webrtc') && (
                <>
                  <li
                    className={`column ${isDark ? 'is-dark-200' : ''} ${
                      activeTab === 'events' ? 'is-active' : ''
                    }`}
                  >
                    <a
                      onClick={() => {
                        setActiveTab('events');
                      }}
                    >
                      Events
                    </a>
                  </li>
                  <li
                    className={`column ${isDark ? 'is-dark-200' : ''} ${
                      activeTab === 'headers' ? 'is-active' : ''
                    }`}
                  >
                    <a onClick={() => setActiveTab('headers')}>
                      {gRPC === true ? 'Metadata' : 'Headers'}
                    </a>
                  </li>

                  <li
                    className={`column ${isDark ? 'is-dark-200' : ''} ${
                      activeTab === 'cookies' ? 'is-active' : ''
                    }`}
                  >
                    <a onClick={() => setActiveTab('cookies')}>Cookies</a>
                  </li>
                </>
              )}
              <li
                className={`column ${isDark ? 'is-dark-200' : ''} ${
                  activeTab === 'tests' ? 'is-active' : ''
                }`}
              >
                <a onClick={() => setActiveTab('tests')}>Tests</a>
              </li>
            </ul>
          </div>
          {/* RESPONSES CONTENT */}
          <div className="is-flex-grow-3 add-vertical-scroll is-flex is-flex-direction-column">
            {activeTab === 'events' && (
              <EventsContainer currentResponse={currentResponse as any} />
            )}
            {activeTab === 'headers' && (
              <HeadersContainer
                currentResponse={
                  currentResponse as {
                    response: { headers: Record<string, string> };
                  }
                }
              />
            )}
            {activeTab === 'cookies' && (
              <CookiesContainer currentResponse={currentResponse} />
            )}
            {activeTab === 'tests' && (
              <TestsContainer currentResponse={currentResponse} />
            )}
            {/* currentResponse.request?.network === "ws" */}
            {activeTab === 'wsWindow' && (
              <WebSocketWindow key={0} content={currentResponse} />
            )}
            {activeTab === 'webrtc' &&
              currentResponse.request.webRTCDataChannel === 'Video' && (
                <div className="box is-flex">
                  <WebRTCVideoBox streamType={'localstream'} />
                  <WebRTCVideoBox streamType={'remotestream'} />
                </div>
              )}
            {activeTab === 'webrtc' &&
              currentResponse.request.webRTCDataChannel === 'Text' && (
                <WebRTCTextContainer />
              )}
          </div>

          {/* RENDER RE-SEND REQUEST BUTTON ONLY FOR NOT WEB SOCKETS / SUBSCRIPTIONS */}
          {id &&
            request?.method !== 'WS' &&
            request?.method !== 'SUBSCRIPTION' &&
            (connection === 'closed' || connection === 'error') && (
              <div className="is-3rem-footer">
                <button
                  className="button is-normal is-fullwidth is-primary-100 is-button-footer is-margin-top-auto add-request-button"
                  onClick={() => {
                    ReqResCtrl.openReqRes(id);
                  }}
                  type="button"
                >
                  Re-Send Request
                </button>
              </div>
            )}
        </div>
        {/* CLOSE RESPONSE BUTTON */}
        {(request?.method === 'WS' ||
          request?.method === 'SUBSCRIPTION' ||
          request?.isSSE ||
          isHTTP2) &&
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
        {(request?.method === 'WS' || request?.method === 'SUBSCRIPTION') &&
          (connection === 'closed' || connection === 'error') && (
            <div className="is-3rem-footer mx-3">
              <button
                className="button is-normal is-fullwidth is-primary-100 is-button-footer is-margin-top-auto add-request-button"
                onClick={() => {
                  ReqResCtrl.openReqRes(id);
                }}
                type="button"
              >
                Re-Open Connection
              </button>
            </div>
          )}
      </div>
    </Box>
  );
};

export default ResponsePaneContainer;
