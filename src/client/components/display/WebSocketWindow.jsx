import React, { Component } from 'react';

class WebSocketWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        WebSocketWindow
      </div>
    )
  }
}

export default WebSocketWindow;