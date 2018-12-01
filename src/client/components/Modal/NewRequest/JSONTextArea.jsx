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
          style={{'resize' : 'none'}} 
          type='text' 
          rows={8} 
          value={this.props.newRequestBody.JSONFormatted ? JSON.stringify(this.props.newRequestBody.bodyContent,undefined,4) : this.props.newRequestBody.bodyContent}
          placeholder='Body' 
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyContent : e.target.value,
            });
            // let parsedValue;
            // let isJSONFormatted;
            // try {
            //   parsedValue = JSON.parse(e.target.value);
            //   this.setState({
            //     lastParseWasSuccess : true,
            //   })
            //   isJSONFormatted = true;
            // }
            // catch (error) {
            //   console.log('error')
            //   parsedValue = e.target.value;
            //   this.setState({
            //     lastParseWasSuccess : false,
            //   });
            //   isJSONFormatted = false;
            // }
            // console.log(parsedValue);
            // this.props.updateJSONFormatted(isJSONFormatted);
            // this.props.updateBodyContent(parsedValue);
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
