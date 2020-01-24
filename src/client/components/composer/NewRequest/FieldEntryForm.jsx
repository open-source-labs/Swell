import React, { Component } from 'react';
import ProtocolSelect from "./ProtocolSelect.jsx";
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

class FieldEntryForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  onChangeHandler(e, property, graphQL) {
    let value = e.target.value;
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
        let grabbedProtocol, afterProtocol;
        if (!!this.props.newRequestFields.url) {
          grabbedProtocol = this.props.newRequestFields.url.match(/(https?:\/\/)|(localhost:)|(wss?:\/\/)/) !== null
            ? this.props.newRequestFields.url.match(/(https?:\/\/)|(localhost:)|(wss?:\/\/)/)[0]
            : ""
          afterProtocol = this.props.newRequestFields.url.substring(grabbedProtocol.length, this.props.newRequestFields.url.length)
        }
        else afterProtocol = ''

        if (!!graphQL) { //if graphql
          this.props.setNewRequestFields({
            ...this.props.newRequestFields,
            protocol: '',
            url: `http://${afterProtocol}`,
            method: 'QUERY',
            graphQL: true,
            gRPC: false
          })
          this.props.setNewRequestBody({ //when switching to GQL clear body
            ...this.props.newRequestBody,
            bodyType: 'GQL',
            bodyContent: `query {

}`
          });
          break;
        }
        else if (value === 'http://') { //if http/s
          this.props.setNewRequestFields({
            ...this.props.newRequestFields,
            protocol: '',
            url: `http://${afterProtocol}`,
            method: 'GET',
            graphQL: false,
            gRPC: false
          })
          this.props.setNewRequestBody({ //when switching to http clear body
            ...this.props.newRequestBody,
            bodyType: 'none',
            bodyContent: ``
          });
          break;
        }
        else if (value === '') { //if gRPC
          this.props.setNewRequestFields({
            ...this.props.newRequestFields,
            protocol: '',
            url: `${afterProtocol}`,
            method: '',
            graphQL: false,
            gRPC: true
          })
          this.props.setNewRequestBody({ //when switching to gRPC clear body
            ...this.props.newRequestBody,
            bodyType: 'GRPC',
            bodyContent: ``
          });
          break;
        }
        else if (value === 'ws://') { //if ws
          this.props.setNewRequestFields({
            ...this.props.newRequestFields,
            protocol: value,
            url: value + afterProtocol,
            method: '',
            graphQL: false,
            gRPC: false
          })
          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType: 'none',
            bodyContent: '',
          });
        }
        //removes Content-Type Header
        const filtered = this.props.newRequestHeaders.headersArr.filter(header => header.key.toLowerCase() !== 'content-type')
        this.props.setNewRequestHeaders({
          headersArr: filtered,
          count: filtered.length,
        });
        break;
      }
      case 'method': {
        const methodReplaceRegex = new RegExp(`${this.props.newRequestFields.method}`, 'mi')
        let newBody = "";
        if (!this.props.newRequestFields.graphQL && !this.props.newRequestFields.gRPC) { //if one of 5 http methods (get, post, put, patch, delete)
          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyType: 'none',
            bodyContent: '',
          });
        }
        // GraphQL features
        else if (value === 'QUERY') {
          //if switching to graphQL = true
          if (!this.props.newRequestFields.graphQL) newBody = `query {

}`
          else newBody = methodReplaceRegex.test(this.props.newRequestBody.bodyContent)
            ? this.props.newRequestBody.bodyContent.replace(methodReplaceRegex, 'query')
            : `query ${this.props.newRequestBody.bodyContent}`

          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyContent: newBody
          });
        }
        else if (value === 'MUTATION') {
          newBody = methodReplaceRegex.test(this.props.newRequestBody.bodyContent)
            ? this.props.newRequestBody.bodyContent.replace(methodReplaceRegex, 'mutation')
            : `mutation ${this.props.newRequestBody.bodyContent}`

          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyContent: newBody
          });
        }
        else if (value === 'SUBSCRIPTION') {
          newBody = methodReplaceRegex.test(this.props.newRequestBody.bodyContent)
            ? this.props.newRequestBody.bodyContent.replace(methodReplaceRegex, 'subscription')
            : `subscription ${this.props.newRequestBody.bodyContent}`

          this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            bodyContent: newBody
          });
        }

        //always set new method
        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          method: value,
          protocol: value === 'SUBSCRIPTION' ? 'ws://' : '',
          url: value === 'SUBSCRIPTION' ? 'ws://' : 'https://',
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
        <ProtocolSelect
          currentProtocol={this.props.newRequestFields.protocol}
          onChangeHandler={this.onChangeHandler}
          graphQL={this.props.newRequestFields.graphQL}
          gRPC={this.props.newRequestFields.gRPC}
        />

        <div className={'composer_method_url_container'}>

          {/* below conditional method selection rendering for http/s */}
          {
            !/wss?:\/\//.test(this.props.newRequestFields.protocol) && !this.props.newRequestFields.graphQL && !this.props.newRequestFields.gRPC &&

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
            // !/wss?:\/\//.test(this.props.newRequestFields.protocol) && 
            this.props.newRequestFields.graphQL &&

            <select style={{ display: 'block' }} value={this.props.newRequestFields.method} className={'composer_method_select gql'} onChange={(e) => {
              this.onChangeHandler(e, 'method')
            }}>
              <option value='QUERY'>QUERY</option>
              <option value='MUTATION'>MUTATION</option>
              <option value='SUBSCRIPTION'>SUBSCRIPTION</option>
            </select>
          }

          {/* gRPC stream type button */}
          {
            this.props.newRequestFields.gRPC &&
            <button style={{ display: 'block' }} id='stream' value='STREAM' className={'composer_method_select grpc'}>STREAM</button>
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

export default FieldEntryForm;
