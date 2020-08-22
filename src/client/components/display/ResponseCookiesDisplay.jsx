import React, { Component } from 'react';
import CookieTable from './CookieTable.tsx';

class ResponseCookiesDisplay extends Component {
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
      if (!this.props.responseContent.cookies) {
        displayContents.push(<p className="reqResContent" key={`reqResRESContent${idx}`} >No Response Cookies</p>)
        return;
      }
      displayContents.push(
        <CookieTable
          className="cookieTable"
          cookies={this.props.responseContent.cookies}
          key="{cookieTable}"
        />,
      );
    });

    return <div className="tab_content-response">{displayContents}</div>;
  }
}

export default ResponseCookiesDisplay;
