import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import JSONPretty from "react-json-pretty";
import createDOMPurify from "dompurify";
import EmptyState from '../display/EmptyState';
import SSERow from "../display/SSERow.jsx";
import 'codemirror/theme/neo.css'


export default function EventsContainer({currentResponse}) {

  if (!currentResponse.response) {
    return (
      <EmptyState />
    )
  }

  const { events, headers } = currentResponse.response;
  let displayContents;

  // If it's an SSE, render event rows
  // console.log('response is : ', response, 'headers is : ', headers)
  if (
    headers && 
    headers["content-type"] &&
    headers["content-type"] === "text/event-stream"
  ) {
    // console.log('EventsContainer1')
    displayContents = [];
    events.forEach((cur, idx) => {
      displayContents.push(<SSERow key={idx} content={cur} />);
    });
  }
  // if the response content-type, purify and render html
  else if (
    headers &&
    headers["content-type"] &&
    headers["content-type"].includes("text/html")
  ) {
    // console.log('EventsContainer2')

    // console.log("headers:content-type ->", headers["content-type"]);
    // console.log("events0 -> ", events[0]);
    displayContents = (
      <div
        className="okay"
        key="http2_html_content"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: createDOMPurify.sanitize(events[0]),
        }}
      />
    );
  } else if (events && events.length > 1) {
    // console.log('EventsContainer3')

    if (events) {
      let resEvents = "";
      let eventJSON;
      for (const event of events) {
        eventJSON = JSON.stringify(event, null, 4);
        resEvents = resEvents + '\n' + eventJSON;
      }
      displayContents = (
        <div className="json-response" key="jsonresponsediv">
        <CodeMirror
          // value={JSON.stringify(resEvents, null, 4)}
          value={resEvents}
          options={{
            mode: 'application/json',
            theme: 'neo responsebody',
            lineNumbers: true,
            tabSize: 4,
            lineWrapping: true,
            readOnly: true,
            setSize: '100%',
          }}
        />
        </div>
      ); 
    }
  }

  // Otherwise, render a single display
  else if (events) {
    // console.log('EventsContainer4')

    displayContents = (
      <CodeMirror
        value={JSON.stringify(events[0], null, 4)}
        options={{
          mode: 'application/json',
          theme: 'neo responsebody',
          lineNumbers: true,
          tabSize: 4,
          lineWrapping: true,
          readOnly: true,
        }}
      />
    );
  }

  return <div className="tab_content-response">{displayContents}</div>;


}