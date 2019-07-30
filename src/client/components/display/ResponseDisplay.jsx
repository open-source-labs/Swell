import React, { Component } from 'react';
import SSERow from './SSERow.jsx';
import CookieTable from './CookieTable.jsx';
import JSONPretty from 'react-json-pretty';

class ResponseDisplay extends Component {
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
      const responseHeaders = cur.responseContent.headers;
      const responseCookies = cur.responseContent.cookies;
      if (responseHeaders) {
        const responseContentType = responseHeaders['content-type'];
        const tabState = this.props.openTabs;

        // Step 3  - Check content type of each response Update to use includes
        if (tabState === 'Response Events') {
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
                    }} />
                </div>
              );
            })
          }
        }
        else if (tabState === 'Response Headers') {
          const headerObj = this.props.responseContent.headers;
          console.log('responseTabs.jsx headers: ', this.props.responseContent.headers)
          if (!Array.isArray(headerObj) && headerObj) {
            for (const key in headerObj) {
              if (!Array.isArray(cur)) {
                tabContentShownEvents.push(
                  <div className="grid-2" key={key}>
                    <span className="tertiary-title title_offset">{key}</span>
                    <span className="tertiary-title title_offset">
                      {headerObj[key]}
                    </span>
                  </div>,
                );
              }
              else {
                console.log('Header Object was incorrect');
              }
            }
          }
        }
        else if (this.state.openTabs === 'Response Cookies') {
          tabContentShownEvents.push(
            <CookieTable
              className="cookieTable"
              cookies={this.props.responseContent.cookies}
              key="{cookieTable}"
            />,
          );
        }
      }
    });

    return (
      <div className="tab_content-response">{tabContentShownEvents}</div>
    )
  }
}

export default ResponseDisplay;
