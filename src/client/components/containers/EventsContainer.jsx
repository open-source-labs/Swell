import React from 'react';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from "@codemirror/view"
import { json } from '@codemirror/lang-json';
import EmptyState from '../display/EmptyState';
import EventPreview from '../display/EventPreview';
// import 'codemirror/theme/neo.css';


function EventsContainer({ currentResponse }) {
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

  const isDark = useSelector(state => state.ui.isDark);

  return (
    <div
      className="tab_content-response overflow-event-parent-container"
      id="events-display"
    >
      {request.method === 'GET' && (
        <EventPreview
          className={`${isDark ? 'is-dark-200' : ''} overflow-event-child-container`}
          contents={responseBody}
        />
      )}
      <div className={`${isDark ? 'is-dark-200' : ''} overflow-event-parent-container`}>
        {/* {responseBody} */}
        <CodeMirror
          className="overflow-event-child-container"
          value={responseBody}
          extensions={[
            json(),
            EditorView.lineWrapping,
          ]}
          theme = 'dark'
          readOnly= 'true'
          height="100%"
          width = "100%"
          maxWidth='400px'
          maxHeight='300px'
        />
      </div>
    </div>
  );
}

export default EventsContainer;
