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
      'modal_bodytype_button' : true,
      'modal_bodytype_button-selected' : this.props.newRequestBody.bodyType === 'none'
    });
    let XWWWFormUrlEncodedStyleClasses = classNames({
      'modal_bodytype_button' : true,
      'modal_bodytype_button-selected' : this.props.newRequestBody.bodyType === 'x-www-form-urlencoded'
    });
    let RawStyleClasses = classNames({
      'modal_bodytype_button' : true,
      'modal_bodytype_button-selected' : this.props.newRequestBody.bodyType === 'raw'
    });

    return(
      <div className={"modal_protocol_container"} style={{'marginTop' : '4px'}}>
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
