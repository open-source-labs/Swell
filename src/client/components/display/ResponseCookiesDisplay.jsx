import React, { Component } from 'react';
import SSERow from './SSERow.jsx';
import CookieTable from './CookieTable.jsx';
import JSONPretty from 'react-json-pretty';

class ResponseCookiesDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const tabContentShownEvents = [];

    // Step 1  - Locate responses from store add them to cache array
    const responsesCache = [];
    console.log('this.props', this.props);
    responsesCache.push(this.props);
    console.log('responsesCache', responsesCache);

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

    return <div className="tab_content-response">{tabContentShownEvents}</div>
  }
}

export default ResponseCookiesDisplay;
