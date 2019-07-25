import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
import ProtocolSelect from "./ProtocolSelect.jsx";
import PropTypes from "prop-types";

const classNames = require('classnames');

const mapStateToProps = store => ({
  newRequestFields : store.business.newRequestFields,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestFields : (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody : (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

class FieldEntryForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  onChangeHandler(e, property) {
    // console.log(this.props);
    let value = e.target.value;
    switch (property) {
      case 'url' : {
        let url = this.props.newRequestFields.protocol + value.replace(/(h?.?t?.?t?.?p?.?s?.?|w?.?s?.?)(:[^\/]?\/?.?\/?)/, '')

        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          url: url,
        })
        break;
      }
      case 'protocol' : {
        let url = value + this.props.newRequestFields.url.replace(/(h?t?t?p?s?|w?s?):\/?\/?/, '');

        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          url: url,
          protocol : value,
        })
        break;
      }
      case 'method' : {
        if (value === 'GET') {
          this.props.setNewRequestBody ({
            ...this.props.newRequestBody,
            bodyContent : '',
          });
        }
        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          method : value,
        })
      }
    }
  };
  handleKeyPress(event){
    if(event.key === 'Enter'){
      console.log('enter press here! ')
      this.props.addRequestProp();
    }
  }

  render() {
    // console.log(this.props);
    let HTTPMethodStyle = {
      display : this.props.newRequestFields.protocol !== 'ws://' ? 'block' : 'none',
    }
   

    return(
      // <div style={this.props.stylesObj}>
      <div>
        <ProtocolSelect currentProtocol={this.props.newRequestFields.protocol} onChangeHandler={this.onChangeHandler}/>

        <div className={'composer_method_url_container'}>
          <select style={HTTPMethodStyle} value={this.props.newRequestFields.method} className={'composer_method_select'} onChange={(e) => {
            this.onChangeHandler(e, 'method')
          }}>
            <option value='GET'>GET</option>
            <option value='POST'>POST</option>
            <option value='PUT'>PUT</option>
            <option value='PATCH'>PATCH</option>
            <option value='DELETE'>DELETE</option>
          </select>

          <input className={'composer_url_input'} type='text' placeholder='URL' value={this.props.newRequestFields.url} onChange={(e) => {
            this.onChangeHandler(e, 'url')
          }} onKeyPress={this.handleKeyPress} 
          ref={input => {
            this.myInput = input;
          }}
          ></input>
        </div>
      </div>
    )
  }
}

FieldEntryForm.propTypes = {
  // stylesObj : PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldEntryForm);