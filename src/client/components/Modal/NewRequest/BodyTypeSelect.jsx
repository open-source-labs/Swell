import React, { Component } from 'react';
import PropTypes from "prop-types";
const classNames = require('classnames');

class BodyTypeSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let NoneStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.bodyType === 'none'
    });
    let XWWWFormUrlEncodedStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.bodyType === 'x-www-form-urlencoded'
    });
    let RawStyleClasses = classNames({
      'modal_protocol_button' : true,
      'modal_protocol_button-selected' : this.props.bodyType === 'raw'
    });

    return(
      <div className={"modal_protocol_container"}>
        <div 
          className={NoneStyleClasses} 
          onMouseDown={() => this.props.updateBodyType('none')}>
          none
        </div>
        <div 
          className={XWWWFormUrlEncodedStyleClasses} 
          onMouseDown={() => this.props.updateBodyType('x-www-form-urlencoded')}>
          x-www-form-urlencoded
        </div>
        <div 
          className={RawStyleClasses} 
          onMouseDown={() => this.props.updateBodyType('raw')}>
          raw
        </div>
      </div>
    )
  }
}

BodyTypeSelect.propTypes = {
  bodyType : PropTypes.string.isRequired,
  updateBodyType : PropTypes.func.isRequired,
};

export default (BodyTypeSelect);