import React, { Component } from 'react';

import ReactJson from 'react-json-view'

class ResponsePlain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    const json = this.props.content.events[0].data;
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ResponsePlain

        <ReactJson src={json} name={false} collapsed={1} />
 
      </div>
    )
  }
}

export default ResponsePlain;