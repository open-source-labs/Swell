import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import EmptyState from '../display/EmptyState';
import 'codemirror/theme/neo.css'


export default function EventsContainer({currentResponse}) {
  
  const { response } = currentResponse;
  if (!response || !response.events || response.events.length < 1) {
    return (
      <EmptyState connection={currentResponse.connection}/>
    );
  }
    
  const { events, headers } = response;
  
  let responseBody = '';

  // If it's a stream
  if (
    (
      headers && 
      headers["content-type"] &&
      headers["content-type"].includes('stream')
    ) ||
    (
      events && 
      events.length > 1
    )
  ) {
    events.forEach((event, idx) => {
      const eventStr = JSON.stringify(event, null, 4);
      responseBody += `-------------Stream Event ${idx + 1}-------------\n${eventStr}\n\n`;
    });
  }
  // If it's a single response
  else {
    responseBody = JSON.stringify(events[0], null, 4);
  }
  return (
    <div className="tab_content-response" id="events-display">
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