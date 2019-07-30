import React, { Component } from 'react';

class ResponseHeadersDisplay extends Component {
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
    });
    return <div className="tab_content-response">{tabContentShownEvents}</div>
  }
}
export default ResponseHeadersDisplay;
