import React, { Component } from 'react';
import Tab from './Tab.jsx';
import RequestTabs from './RequestTabs.jsx';

class Request extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const headerArr = this.props.content.headers.map((header, index) => (
      <div key={index} style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>{header.key}</div>
        <div style={{ width: '50%' }}>{header.value}</div>
      </div>
    ));

    return (
      <div className="res_header">
        {/* {headerArr} */}
        <RequestTabs requestContent={this.props.content} />
      </div>
    );
  }
}

export default Request;
