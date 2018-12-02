import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

class JSONTextArea extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   lastParseWasSuccess : true,
    // }
  }

  componentDidMount () {
    if (this.props.newRequestBody.bodyContent === "") {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent : '{}',
      });
      return;
    }
    try {
      JSON.parse(this.props.newRequestBody.bodyContent);
      if(!this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted : true
        });
      }
    }
    catch (error) {
      if(this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted : false,
        });
      }
    }
  }

  componentDidUpdate () {
    if (this.props.newRequestBody.bodyContent === "") {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent : '{}',
      });
      return;
    }
    try {
      console.log('intry');
      JSON.parse(this.props.newRequestBody.bodyContent);
      if(!this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted : true
        });
      }
    }
    catch (error) {
      if(this.props.newRequestBody.JSONFormatted) {
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          JSONFormatted : false,
        });
      }
    }
  }

  render() {
    return(
      <div>
        <div>{this.props.newRequestBody.JSONFormatted ? 'JSON correctly formatted.' : 'JSON incorrectly formatted (double quotes only).'}</div>
        <textarea 
          style={{'resize' : 'none', 'width' : '100%'}} 
          type='text' 
          rows={8} 
          value={this.props.newRequestBody.bodyContent}
          placeholder='Body' 
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyContent : e.target.value,
            });
          }}></textarea>
      </div>
    );
  }
}

JSONTextArea.propTypes = {
  setNewRequestBody : PropTypes.func.isRequired,
  newRequestBody : PropTypes.object.isRequired,
};

export default JSONTextArea;
