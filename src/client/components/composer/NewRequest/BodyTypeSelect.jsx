import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

class BodyTypeSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props)
    let NoneStyleClasses = classNames({
      'composer_bodytype_button' : true,
      'composer_bodytype_button-selected' : this.props.newRequestBody.bodyType === 'none'
    });
    let XWWWFormUrlEncodedStyleClasses = classNames({
      'composer_bodytype_button' : true,
      'composer_bodytype_button-selected' : this.props.newRequestBody.bodyType === 'x-www-form-urlencoded'
    });
    let RawStyleClasses = classNames({
      'composer_bodytype_button' : true,
      'composer_bodytype_button-selected' : this.props.newRequestBody.bodyType === 'raw'
    });

    return(
      <div className={"composer_protocol_container httpbody"} style={{'marginTop' : '4px'}}>
        <div 
          style={{'width' : '17%'}}
          className={NoneStyleClasses} 
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType : 'none',
            bodyContent : ''
          })}>
          none
        </div>
        <div 
          style={{'width' : '65%'}}
          className={XWWWFormUrlEncodedStyleClasses} 
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType : 'x-www-form-urlencoded'
          })}>
          x-www-form-urlencoded
        </div>
        <div
          style={{'width' : '14%'}} 
          className={RawStyleClasses} 
          onMouseDown={() => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType : 'raw'
          })}>
          raw
        </div>
      </div>
    );
  }
}

BodyTypeSelect.propTypes = {
  newRequestBody : PropTypes.object.isRequired,
  setNewRequestBody : PropTypes.func.isRequired,
};

export default BodyTypeSelect;