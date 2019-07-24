import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

class JSONTextArea extends Component {
  constructor(props) {
    super(props);
    this.prettyPrintJSON = this.prettyPrintJSON.bind(this);
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

  prettyPrintJSON () {
    let prettyString = JSON.stringify(JSON.parse(this.props.newRequestBody.bodyContent), null, 4);
    this.props.setNewRequestBody({
      ...this.props.newRequestBody,
      bodyContent : prettyString,
    })
  }

  render() {
    let prettyPrintDisplay = {
      'display' : this.props.newRequestBody.JSONFormatted ? 'block' : 'none',
    }
    let textAreaClass = this.props.newRequestBody.JSONFormatted ? 'composer_textarea' : 'composer_textarea composer_textarea-error';
    
    return(
      <div>
        <textarea 
          className={textAreaClass}
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
          }}>
        </textarea>
        <div 
          style={prettyPrintDisplay}
          className={'composer_pretty_print'} 
          onClick={this.prettyPrintJSON}>JSON correctly formatted. Pretty print?
        </div>
      </div>
    );
  }
}

JSONTextArea.propTypes = {
  setNewRequestBody : PropTypes.func.isRequired,
  newRequestBody : PropTypes.object.isRequired,
};

export default JSONTextArea;
