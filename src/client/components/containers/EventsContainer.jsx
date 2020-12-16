import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import EmptyState from '../display/EmptyState';
import EventPreview from '../display/EventPreview';
import 'codemirror/theme/neo.css'


export default function EventsContainer({currentResponse}) {
  
  const { request, response } = currentResponse;
  if (!response || !response.events || response.events.length < 1) {
    return (
      <EmptyState connection={currentResponse.connection}/>
    );
  }
    
  const { events, headers } = response;
  
  let responseBody = '';

  // If it's a stream or graphQL subscription
  if (
    (events && events.length > 1) ||
    (headers?.["content-type"] && headers["content-type"].includes('stream')) ||
    (currentResponse.graphQL && request.method === 'SUBSCRIPTION')
  ) {

    let eventType = 'Stream';
    if (currentResponse.graphQL && request.method === 'SUBSCRIPTION') {
      eventType = 'Subscription'
    }

    events.forEach((event, idx) => {
      const eventStr = JSON.stringify(event, null, 4);
      responseBody += `-------------${eventType} Event ${idx + 1}-------------\n${eventStr}\n\n`;
    });
  }
  // If it's a single response
  else {
    responseBody = JSON.stringify(events[0], null, 4);
  }
  return (
    <div className="tab_content-response" id="events-display">
      {request.method === 'GET' && (
        <EventPreview contents={responseBody}/>
      )}
      <CodeMirror
        value={responseBody}
        options={{
          mode: 'application/json',
          theme: 'neo responsebody',
          lineNumbers: true,
          tabSize: 4,
          lineWrapping: true,
          readOnly: true,
        }}
      />
    </div>
  );


}