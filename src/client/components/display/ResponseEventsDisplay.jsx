import React from 'react';
import SSERow from './SSERow.jsx';
import JSONPretty from 'react-json-pretty';
import createDOMPurify from 'dompurify';



const ResponseEventsDisplay = ({ response }) => {
  const { events, headers } = response;
  const displayContents = [];
  // console.log('what is events' , events)
  // If it's an SSE, render event rows
  
  if (headers && headers['content-type'] && headers['content-type'].includes('text/event-stream')) {
    events.forEach((cur, idx) => {
      displayContents.push(<SSERow key={idx} content={cur} />);
    });
  }
  // if the response content-type, purify and render html
  else if (headers && headers['content-type'] && headers['content-type'].includes('text/html')) {
    displayContents.push(
      <div className="okay" dangerouslySetInnerHTML={{__html: createDOMPurify.sanitize(events[0])}} />
    )
  }
  else if (events && events.length > 1) {
    if (events) {
      let resEvents = '';
      let eventJSON;
      for (const event of events) {
        eventJSON = JSON.stringify(event, null, 4);
        resEvents = `${resEvents}
${eventJSON}`
      }
      displayContents.push(
        <div className="json-response" key="jsonresponsediv">
          <JSONPretty data={resEvents} space="4" theme={{
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
    
  }

  // Otherwise, render a single display
  else {
    if (events) {
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
  }

  return <div className="tab_content-response">{displayContents}</div>;
}

export default ResponseEventsDisplay;
