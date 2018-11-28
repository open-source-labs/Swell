import React, { Component } from 'react';

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
      <div className="resreq-res-header">
        <span className="tertiary-title">
          {this.props.content.method}
          {' '}
Request
        </span>
        {headerArr}
        {JSON.stringify(this.props.content.body)}
      </div>
    );
  }
}

export default Request;
