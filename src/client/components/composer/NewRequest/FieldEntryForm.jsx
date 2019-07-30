import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
import ProtocolSelect from "./ProtocolSelect.jsx";
import PropTypes from "prop-types";

const classNames = require('classnames');

const mapStateToProps = store => ({
  newRequestFields: store.business.newRequestFields,
  newRequestBody: store.business.newRequestBody
});

const mapDispatchToProps = dispatch => ({
  setNewRequestFields: (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

class FieldEntryForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    // this.props.graphQL && this.props.setGraphQL
  }

  onChangeHandler(e, property, graphQL) {

    let value = e.target.value;
    const methodReplaceRegex = new RegExp(`${this.props.newRequestBody.bodyContent}`, 'mi')
    switch (property) {
      case 'url': {
        let url = value;
        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          url: url,
        })
        break;
      }
      case 'protocol': {
        let grabbedProtocol, afterProtocol, composedURL;
        if (!!this.props.newRequestFields.url) {
          grabbedProtocol = this.props.newRequestFields.url.match(/(https?:\/\/)|(ws:\/\/)/)
          ? this.props.newRequestFields.url.match(/(https?:\/\/)|(ws:\/\/)/)[0]
          : '';
          afterProtocol = this.props.newRequestFields.url.substring(grabbedProtocol.length, this.props.newRequestFields.url.length);
          composedURL = grabbedProtocol !== 'ws://' ? grabbedProtocol + afterProtocol : 'http://' + afterProtocol;
        }
        else {
          grabbedProtocol = '';
          afterProtocol = '';
          composedURL = '';
        }

        if (!!graphQL) { //if graphql
          this.props.setNewRequestFields({
            ...this.props.newRequestFields,
            protocol: '',
            url: composedURL,
            method: 'QUERY',
            graphQL: true
          })
          this.props.setNewRequestBody({ //when switching to GQL clear body
            ...this.props.newRequestBody,
            bodyType: 'GQL',
            bodyContent: `query {

}`
          });
          break;
        }
        else if (value === 'ws://') { //if ws
          this.props.setNewRequestFields({
            ...this.props.newRequestFields,
            protocol: value,
            url: value + afterProtocol,
            method: 'GET',
            graphQL: false
          })
        }
        else { //if http/s
          this.props.setNewRequestFields({
            ...this.props.newRequestFields,
            protocol: '',
            url: 'http://' + afterProtocol,
            method: 'GET',
            graphQL: false
          })
        }
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          bodyType: 'none',
          bodyContent: '',
        });
        break;
      }
      case 'method': {
        if (!this.props.newRequestFields.graphQL) { //if one of 5 http methods (get, post, put, patch, delete)
          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType: 'none',
            bodyContent: '',
          });
        }
        else if (value === 'QUERY') {
          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyContent: (this.props.newRequestFields.method === "MUTATION" || this.props.newRequestFields.method === "SUBSCRIPTION")
            ? this.props.newRequestBody.bodyContent.replace(methodReplaceRegex, 'query') + this.props.newRequestBody.bodyContent.substring(this.props.newRequestFields.method.length, this.props.newRequestBody.bodyContent.length)
            : `query {

}`
          });
        }
        else if (value === 'MUTATION') {
          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyContent: this.props.newRequestBody.bodyContent.replace(methodReplaceRegex, 'mutation') + this.props.newRequestBody.bodyContent.substring(this.props.newRequestFields.method.length, this.props.newRequestBody.bodyContent.length)
          });
        }
        else if (value === 'SUBSCRIPTION') {
          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyContent: this.props.newRequestBody.bodyContent.replace(methodReplaceRegex, 'subscription') + this.props.newRequestBody.bodyContent.substring(this.props.newRequestFields.method.length, this.props.newRequestBody.bodyContent.length)
          });
        }
        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          method: value,
        })
      }
    }
  };

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.props.addRequestProp();
    }
  }

  render() {

    return (
      <div>
        <ProtocolSelect currentProtocol={this.props.newRequestFields.protocol} onChangeHandler={this.onChangeHandler} graphQL={this.props.newRequestFields.graphQL} />

        <div className={'composer_method_url_container'}>

          {/* below conditional method selection rendering for http/s */}
          {
            this.props.newRequestFields.protocol !== 'ws://' && !this.props.newRequestFields.graphQL &&

            <select style={{ display: 'block' }} value={this.props.newRequestFields.method} className={'composer_method_select http'} onChange={(e) => {
              this.onChangeHandler(e, 'method')
            }}>
              <option value='GET'>GET</option>
              <option value='POST'>POST</option>
              <option value='PUT'>PUT</option>
              <option value='PATCH'>PATCH</option>
              <option value='DELETE'>DELETE</option>
            </select>
          }
          {/* below conditional method selection rendering for graphql */}
          {
            this.props.newRequestFields.protocol !== 'ws://' && this.props.newRequestFields.graphQL &&

            <select style={{ display: 'block' }} value={this.props.newRequestFields.method} className={'composer_method_select gql'} onChange={(e) => {
              this.onChangeHandler(e, 'method')
            }}>
              <option value='QUERY'>QUERY</option>
              <option value='MUTATION'>MUTATION</option>
              <option value='SUBSCRIPTION'>SUBSCRIPTION</option>
            </select>
          }

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldEntryForm);