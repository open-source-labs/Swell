import React, { Component } from 'react';
import PropTypes from "prop-types";
const classNames = require('classnames');

class ProtocolSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let HTTPStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.currentProtocol === 'http://'
    });
    let HTTPSStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.currentProtocol === 'https://'
    });
    let WSStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.currentProtocol === 'ws://'
    });

    return(
      <div className={"modal_protocol_container"}>
        <div 
          className={HTTPStyleClasses} 
          onMouseDown={() => this.props.onChangeHandler({ target : { value : 'http://' }}, 'protocol')}>
          HTTP
        </div>
        <div 
          className={HTTPSStyleClasses} 
          onMouseDown={() => this.props.onChangeHandler({ target : { value : 'https://' }}, 'protocol')}>
          HTTPS
        </div>
        <div 
          className={WSStyleClasses} 
          onMouseDown={() => this.props.onChangeHandler({ target : { value : 'ws://' }}, 'protocol')}>
          WS
        </div>
      </div>
    )
  }
}

ProtocolSelect.propTypes = {
  currentProtocol : PropTypes.string.isRequired,
  onChangeHandler : PropTypes.func.isRequired,
};

export default (ProtocolSelect);