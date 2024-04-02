import React from 'react';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import EmptyState from './EmptyState';
import EventPreview from './EventPreview';
import { EditorView } from '@codemirror/view';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { json } from '@codemirror/lang-json';
import { ReqResRequest, RequestWebRTC } from '../../../../types';

interface EventsContainerProps {
  currentResponse: {
    connection: string;
    request: RequestWebRTC | ReqResRequest;
    response: {
      events: any[];
      headers?: {
        'content-type'?: string;
      };
    };
    graphQL?: boolean;
  };
}

function EventsContainer(props: any) {
  const { currentResponse } = props;
  const isDark = useSelector((state: any) => state.ui.isDark);
  const { request, response } = currentResponse;
  if (!response || !response.events || response.events.length < 1) {
    return <EmptyState connection={currentResponse.connection} />;
  }
  const { events, headers } = response;
  let responseBody = '';
  //check if its a trpc response
  if (currentResponse.trpc) {
    if (currentResponse.connection === 'error') {
      const eventStr = JSON.stringify(currentResponse.error, null, 4);
      responseBody += `-------------'ERROR'-------------\n${eventStr}\n\n`;
    } else {
      events.forEach((event: any, idx: number) => {
        if (event) {
          const eventStr = JSON.stringify(event, null, 4);
          responseBody += `-------------${
            idx ? 'Mutate Result' : 'Query result'
          }-------------\n${eventStr}\n\n`;
        }
      });
    }
  }
  // If it's a stream or graphQL subscription
  else if (
    (events && events.length > 1) ||
    (headers?.['content-type'] && headers['content-type'].includes('stream')) ||
    (currentResponse.graphQL && request.method === 'SUBSCRIPTION')
  ) {
    let eventType = 'Stream';
    if (currentResponse.graphQL && request.method === 'SUBSCRIPTION') {
      eventType = 'Subscription';
    }

    events.forEach((event: any, idx: number) => {
      const eventStr = JSON.stringify(event, null, 4);
      responseBody += `-------------${eventType} Event ${
        idx + 1
      }-------------\n${eventStr}\n\n`;
    });
  }
  // If it's a single response
  else {
    responseBody = JSON.stringify(events[0], null, 4);
  }

  return (
    <div
      className="tab_content-response overflow-event-parent-container"
      id="events-display"
    >
      {request.webRTCDataChannel && (
        <div
          id="videos"
          style={{
            height: 'fit-content',
            width: 'fit-content',
            backgroundColor: 'transparent',
          }}
        >
          <video
            className="video-player"
            id="user-2"
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', border: 'solid black' }}
          ></video>
        </div>
      )}
      {request.method === 'GET' && (
        <EventPreview
          className={`${
            isDark ? 'is-dark-200' : ''
          } overflow-event-child-container`}
          contents={responseBody}
        />
      )}
      <div
        className={`${
          isDark ? 'is-dark-400' : ''
        } overflow-event-parent-container`}
      >
        <CodeMirror
          className="overflow-event-child-container"
          value={responseBody}
          theme={vscodeDark}
          readOnly={true}
          extensions={[json(), EditorView.lineWrapping]}
        />
      </div>
    </div>
  );
}

export default EventsContainer;
