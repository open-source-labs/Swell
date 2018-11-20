import React, { Component } from 'react';

import ReactJson from 'react-json-view'

class ResponsePlain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);

    let contentBody = this.props.content.events[0]? <ReactJson src={this.props.content.events[0].data} name={false} collapsed={1} /> : "";

    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ResponsePlain

        {contentBody}
 
      </div>
    )
  }
}

export default ResponsePlain;