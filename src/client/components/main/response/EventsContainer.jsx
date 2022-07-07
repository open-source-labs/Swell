import React from 'react';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
// import { UnControlled as CodeMirror } from 'react-codemirror2';
import EmptyState from './EmptyState';
import EventPreview from './EventPreview';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';

function EventsContainer({ currentResponse }) {
  const isDark = useSelector((state) => state.ui.isDark);

  const { request, response } = currentResponse;
  // console.log('this is the request', request);
  // console.log('this is the response', response);
  if (!response || !response.events || response.events.length < 1) {
    return <EmptyState connection={currentResponse.connection} />;
  }
  const { events, headers } = response;
  // console.log("this is the events", events);
  // console.log("this is the headers", headers);
  let responseBody = '';

  // If it's a stream or graphQL subscription
  if (
    (events && events.length > 1) ||
    (headers?.['content-type'] && headers['content-type'].includes('stream')) ||
    (currentResponse.graphQL && request.method === 'SUBSCRIPTION')
  ) {
    let eventType = 'Stream';
    if (currentResponse.graphQL && request.method === 'SUBSCRIPTION') {
      eventType = 'Subscription';
    }

    events.forEach((event, idx) => {
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
          isDark ? 'is-dark-200' : ''
        } overflow-event-parent-container`}
      >
        {/* {responseBody} */}
        <CodeMirror
          className="overflow-event-child-container"
          value={responseBody}
          theme="dark"
          readOnly={true}
          extensions={[javascript(), EditorView.lineWrapping]}
        />
      </div>
    </div>
  );
}

export default EventsContainer;
