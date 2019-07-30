import React, { Component } from 'react';
import SSERow from './SSERow.jsx';
import JSONPretty from 'react-json-pretty';

class ResponseEventsDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tabContentShownEvents = [];

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
            tabContentShownEvents.push(<SSERow key={idx} content={cur} />);
          });
        }
        else {
          responseEvents.forEach((cur, idx) => {
            tabContentShownEvents.push(
              <div className="json-response" key={`jsonresponsediv+${idx}`}>
                <JSONPretty
                  data={cur}
                  theme={{
                    main: 'line-height:1.3;color:#66d9ef;background:#RRGGBB;overflow:auto;',
                    key: 'color:#f92672;',
                    string: 'color:#fd971f;',
                    value: 'color:#a6e22e;',
                    boolean: 'color:#ac81fe;',
                  }}
                />
              </div>
            );
          });
        }
      }
    });

    return <div className="tab_content-response">{tabContentShownEvents}</div>;
  }
}

export default ResponseEventsDisplay;
