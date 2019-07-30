import React, { Component } from 'react';
import EventRow from './EventRow.jsx';
import JSONPretty from 'react-json-pretty';

const ResponseEventsDisplay = ({ props }) => {
  const { events, headers } = props;
  const displayContents = [];

  // If it's an SSE, render event rows
  if (headers['content-type'] && headers['content-type'].includes('text/event-stream')) {
    events.forEach((cur, idx) => {
      displayContents.push(<EventRow key={idx} content={cur} />);
    });
  }
  // Otherwise, render a single display
  else {
    displayContents.push(
      <div className="json-response" key="jsonresponsediv">
        <JSONPretty data={events[0]} space="4" theme={{
          main: 'line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;',
          key: 'color:#0089D0;', // bluetwo
          string: 'color:#15B78F;',// greenone
          value: 'color:#fd971f;', // a nice orange
          boolean: 'color:#E00198;', // gqlpink
        }}
        />
      </div>
    );
  }

  return <div className="tab_content-response">{displayContents}</div>;
}

export default ResponseEventsDisplay;
