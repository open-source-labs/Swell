import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import JSONPretty from "react-json-pretty";
import createDOMPurify from "dompurify";
import EmptyState from '../display/EmptyState';
import SSERow from "../display/SSERow.jsx";
import 'codemirror/theme/neo.css'


export default function EventsContainer({currentResponse}) {
  
  const { response } = currentResponse;
  if (!response || !response.events || response.events.length < 1) {
    return (
      <EmptyState />
    );
  }
    
  const { events, headers } = response;
  
  const codeMirrorOptions = {
    mode: 'application/json',
    lineNumbers: true,
    tabSize: 4,
    lineWrapping: true,
    readOnly: true,
  };

  let displayContents;

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
    displayContents = events.map((event, idx) => (
      <div className="json-response" key={`jsonresponsediv${idx}`}>
        <CodeMirror
          key={`streamResponse${idx}`}
          id={`streamResponse${idx}`}
          value={JSON.stringify(event, null, 4)}
          options={{
            ...codeMirrorOptions,
            theme: 'neo responsebody-stream',
          }}
        />
      </div>
    ));
  } 

  // Otherwise, render a single display
  else {
    displayContents = (
      <CodeMirror
        value={JSON.stringify(events[0], null, 4)}
        options={{
          ...codeMirrorOptions,
          theme: 'neo responsebody',
        }}
      />
    );
  }

  return <div className="tab_content-response" id="events-display">{displayContents}</div>;


}