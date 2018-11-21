import React, { Component } from 'react';import PropTypes from "prop-types";

class WebSocketMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const styles = {
      'border' : '1px solid black',
      'margin' : '3px', 
      'display' : 'flex',
      'justifyContent' : this.props.source === 'server' ? 'flex-start' : 'flex-end',
    }

    return(
      <div style={styles}>
        <div style={{'width' : '30%'}}>
          {this.props.data}
        </div>
        <div style={{'width' : '30%'}}>
          {this.props.timeReceived}
        </div>
      </div>
    )
  }
}

WebSocketMessage.propTypes = {
  source: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired,
  timeReceived: PropTypes.any.isRequired,
};

export default WebSocketMessage;