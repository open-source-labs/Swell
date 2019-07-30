import React, { Component } from 'react';
import CookieTable from './CookieTable.jsx';

class ResponseCookiesDisplay extends Component {
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
      tabContentShownEvents.push(
        <CookieTable
          className="cookieTable"
          cookies={this.props.responseContent.cookies}
          key="{cookieTable}"
        />,
      );
    });

    return <div className="tab_content-response">{tabContentShownEvents}</div>;
  }
}

export default ResponseCookiesDisplay;
