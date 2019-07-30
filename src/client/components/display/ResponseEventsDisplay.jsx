import React, { Component } from 'react';
import EventRow from './EventRow.jsx';
import JSONPretty from 'react-json-pretty';

class ResponseEventsDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const displayContents = [];

    // Step 1  - Locate responses from store add them to cache array
    const responsesCache = [];
    responsesCache.push(this.props);

    // Step 2  - Increment across all responses in array
    responsesCache.forEach((cur, idx) => {
      const responseEvents = cur.responseContent.events;
      if (this.props.responseContent.headers) {
        const responseContentType = this.props.responseContent.headers['content-type'];

        // Check content type of each response Update to use includes
        if (responseContentType && responseContentType.includes('text/event-stream')) {
          responseEvents.forEach((cur, idx) => {
            displayContents.push(<EventRow key={idx} content={cur} />);
          });
        }
        else {
          responseEvents.forEach((cur, idx) => {
            displayContents.push(
              <div className="json-response" key={`jsonresponsediv+${idx}`}>
                <JSONPretty data={cur} space="4" theme={{
                  main: 'line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;',
                  key: 'color:#0089D0;', //bluetwo
                  string: 'color:#15B78F;',//greenone
                  value: 'color:#fd971f;', //a nice orange
                  boolean: 'color:#E00198;', //gqlpink
                }}
                />
              </div>
            );
          });
        }
      }
    });

    return <div className="tab_content-response">{displayContents}</div>;
  }
}

export default ResponseEventsDisplay;
