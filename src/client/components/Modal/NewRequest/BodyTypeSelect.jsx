import React, { Component } from 'react';
import PropTypes from "prop-types";
const classNames = require('classnames');

class BodyTypeSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props)
    let NoneStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.newRequestBody.bodyType === 'none'
    });
    let XWWWFormUrlEncodedStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.newRequestBody.bodyType === 'x-www-form-urlencoded'
    });
    let RawStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.newRequestBody.bodyType === 'raw'
    });

    return(
      <div className={"modal_protocol_container"}>
        <div 
          className={NoneStyleClasses} 
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType : 'none',
            bodyContent : ''
          })}>
          none
        </div>
        <div 
          className={XWWWFormUrlEncodedStyleClasses} 
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType : 'x-www-form-urlencoded'
          })}>
          x-www-form-urlencoded
        </div>
        <div 
          className={RawStyleClasses} 
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType : 'raw'
          })}>
          raw
        </div>
      </div>
    )
  }
}

BodyTypeSelect.propTypes = {
  newRequestBody : PropTypes.object.isRequired,
  setNewRequestBody : PropTypes.func.isRequired,
};

export default (BodyTypeSelect);