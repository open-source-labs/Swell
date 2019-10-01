import React, { Component } from 'react';
import uuid from 'uuid/v4';
import HeaderEntryForm from './HeaderEntryForm.jsx';
import BodyEntryForm from "./BodyEntryForm.jsx";
import GraphQLBodyEntryForm from "./GraphQLBodyEntryForm.jsx";
import FieldEntryForm from "./FieldEntryForm.jsx";
import CookieEntryForm from './CookieEntryForm.jsx';
import historyController from '../../../controllers/historyController'
import { CLIENT_RENEG_LIMIT } from 'tls';


class ComposerNewRequest extends Component {
  constructor(props) {
    super(props);
    
    this.addNewRequest = this.addNewRequest.bind(this);
    this.handleSSEPayload = this.handleSSEPayload.bind(this);
  }

  componentDidMount(){
    console.log('this.props.newRequestSSE.isSSE: ', this.props.newRequestSSE.isSSE);

  }

  requestValidationCheck() {
    let validationMessage;

    //Error conditions...
    if (/https?:\/\/$|wss?:\/\/$/.test(this.props.newRequestFields.url)) { //if url is only http/https/ws/wss://
      validationMessage = "Please enter a valid URI.";
    }
    if (!(/(https?:\/\/)|(wss?:\/\/)/).test(this.props.newRequestFields.url)) { //if url doesn't have http/https/ws/wss://
      validationMessage = "Please enter a valid URI.";
    }
    else if (!this.props.newRequestBody.JSONFormatted && this.props.newRequestBody.rawType === 'application/json') {
      validationMessage = "Please fix JSON body formatting errors.";
    }
    else if (this.props.newRequestFields.method === "QUERY") {
      if (this.props.newRequestFields.url && !this.props.newRequestBody.bodyContent) {
        validationMessage = "Missing body.";
      }
    }

    return validationMessage || true;
  }

  handleSSEPayload(e){
    this.props.setNewRequestSSE(e.target.checked);
  }

  addNewRequest() {
    const validated = this.requestValidationCheck();

    if (validated === true) {
      let reqRes;
      const protocol = this.props.newRequestFields.url.match(/(https?:\/\/)|(wss?:\/\/)/)[0]
      // HTTP && GRAPHQL REQUESTS
      if (!/wss?:\/\//.test(this.props.newRequestFields.protocol)) {
        let URIWithoutProtocol = `${this.props.newRequestFields.url.split(protocol)[1]}/`;
        const host = protocol + URIWithoutProtocol.split('/')[0];
        let path = `/${URIWithoutProtocol.split('/')
          .splice(1)
          .join('/')
          .replace(/\/{2,}/g, '/')}`;
        if (path.charAt(path.length - 1) === '/' && path.length > 1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/https?:\//g, 'http://');
        let historyBodyContent;
        if (document.querySelector('#gqlBodyEntryTextArea')) { historyBodyContent = document.querySelector('#gqlBodyEntryTextArea').value } //grabs the input value in case tab was last key pressed
        else if (this.props.newRequestBody.bodyContent) { historyBodyContent = this.props.newRequestBody.bodyContent }
        else historyBodyContent = '';

        let historyBodyVariables;
        if (document.querySelector('#gqlVariableEntryTextArea')) { historyBodyVariables = document.querySelector('#gqlVariableEntryTextArea').value } //grabs the input value in case tab was last key pressed
        else historyBodyVariables = '';
        // console.log('in add new request, this.props.newRequestSSE: ', this.props.newRequestSSE)

        reqRes = {

          id: uuid(),
          created_at: new Date(),
          protocol: this.props.newRequestFields.url.match(/https?:\/\//)[0],
          host,
          path,
          url: this.props.newRequestFields.url,
          graphQL: this.props.newRequestFields.graphQL,
          timeSent: null,
          timeReceived: null,
          connection: 'uninitialized',
          connectionType: null,
          checkSelected: false,

          request: {
            method: this.props.newRequestFields.method,
            headers: this.props.newRequestHeaders.headersArr.filter(header => header.active && !!header.key),
            cookies: this.props.newRequestCookies.cookiesArr.filter(cookie => cookie.active && !!cookie.key),
            body: historyBodyContent,
            bodyType: this.props.newRequestBody.bodyType,
            bodyVariables: historyBodyVariables,
            rawType: this.props.newRequestBody.rawType,
            isSSE: this.props.newRequestSSE.isSSE,
          },
          response: {
            headers: null,
            events: null,
          },
          checked: false,
          minimized: false,
          tab: this.props.currentTab,
        };
      }
      // GraphQL Subscriptions
      else if (this.props.newRequestFields.graphQL) {
        let URIWithoutProtocol = `${this.props.newRequestFields.url.split(protocol)[1]}/`;
        const host = protocol + URIWithoutProtocol.split('/')[0];
        let path = `/${URIWithoutProtocol.split('/')
          .splice(1)
          .join('/')
          .replace(/\/{2,}/g, '/')}`;
        if (path.charAt(path.length - 1) === '/' && path.length > 1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/wss?:\//g, 'ws://');
        let historyBodyContent;
        if (document.querySelector('#gqlBodyEntryTextArea')) { historyBodyContent = document.querySelector('#gqlBodyEntryTextArea').value } //grabs the input value in case tab was last key pressed
        else if (this.props.newRequestBody.bodyContent) { historyBodyContent = this.props.newRequestBody.bodyContent }
        else historyBodyContent = '';

        let historyBodyVariables;
        if (document.querySelector('#gqlVariableEntryTextArea')) { historyBodyVariables = document.querySelector('#gqlVariableEntryTextArea').value } //grabs the input value in case tab was last key pressed
        else historyBodyVariables = '';
        reqRes = {

          id: uuid(),
          created_at: new Date(),
          protocol: 'ws://',
          host,
          path,
          url: this.props.newRequestFields.url,
          graphQL: this.props.newRequestFields.graphQL,
          timeSent: null,
          timeReceived: null,
          connection: 'uninitialized',
          connectionType: null,
          checkSelected: false,

          request: {
            method: this.props.newRequestFields.method,
            headers: this.props.newRequestHeaders.headersArr.filter(header => header.active && !!header.key),
            cookies: this.props.newRequestCookies.cookiesArr.filter(cookie => cookie.active && !!cookie.key),
            body: historyBodyContent,
            bodyType: this.props.newRequestBody.bodyType,
            bodyVariables: historyBodyVariables,
            rawType: this.props.newRequestBody.rawType
          },
          response: {
            headers: null,
            events: null,
          },
          checked: false,
          minimized: false,
          tab: this.props.currentTab,
        };
      }
      // WEBSOCKET REQUESTS
      else {
        reqRes = {
          id: uuid(),
          created_at: new Date(),
          protocol: this.props.newRequestFields.url.match(/wss?:\/\//)[0],
          url: this.props.newRequestFields.url,
          timeSent: null,
          timeReceived: null,
          connection: 'uninitialized',
          connectionType: 'WebSocket',
          checkSelected: false,

          request: {
            method: 'WS',
            messages: [],
          },
          response: {
            messages: [],
          },
          checked: false,
          tab: this.props.currentTab,
        };
      }

      historyController.addHistoryToIndexedDb(reqRes);
      this.props.reqResAdd(reqRes);

      //reset for next request
      this.props.setNewRequestHeaders({
        headersArr: [],
        count: 0,
      });

      this.props.setNewRequestCookies({
        cookiesArr: [],
        count: 0,
      });

      this.props.setNewRequestBody({
        bodyContent: '',
        bodyVariables: '',
        bodyType: 'none',
        rawType: 'Text (text/plain)',
        JSONFormatted: true,
      });

      this.props.setNewRequestFields({
        method: 'GET',
        protocol: '',
        url: '',
        graphQL: false
      });
      this.props.setNewRequestSSE(false);
    }
    else {
      this.props.setComposerWarningMessage(validated);
      this.props.setComposerDisplay('Warning');
    }
  }

  render() {
    let HeaderEntryFormStyle = { //trying to change style to conditional created strange duplication effect when continuously changing protocol
      display: !/wss?:\/\//.test(this.props.newRequestFields.protocol) ? 'block' : 'none',
    }
    let SubmitButtonClassName = "composer_submit";
    if (/wss?:\/\//.test(this.props.newRequestFields.protocol) && !this.props.newRequestFields.graphQL) { SubmitButtonClassName += " ws" }
    else if (this.props.newRequestFields.graphQL) { SubmitButtonClassName += " gql" }
    else { SubmitButtonClassName += " http" }

    return (
      <div
        tabIndex={0}
        style={{ display: 'flex', flexDirection: 'column', outline: 'none' }}
      >
        <h1 className="composer_title">Create New Request</h1>

        <FieldEntryForm
          addRequestProp={this.addNewRequest}
          newRequestFields={this.props.newRequestFields}
          newRequestHeaders={this.props.newRequestHeaders}
          newRequestBody={this.props.newRequestBody}
          setNewRequestFields={this.props.setNewRequestFields}
          setNewRequestHeaders={this.props.setNewRequestHeaders}
          setNewRequestCookies={this.props.setNewRequestCookies}
          setNewRequestBody={this.props.setNewRequestBody}
        />

        <HeaderEntryForm
          stylesObj={HeaderEntryFormStyle}
          newRequestHeaders={this.props.newRequestHeaders}
          newRequestBody={this.props.newRequestBody}
          setNewRequestHeaders={this.props.setNewRequestHeaders}
        />

        {
          this.props.newRequestFields.method && !/wss?:\/\//.test(this.props.newRequestFields.protocol) &&
          <CookieEntryForm
            newRequestCookies={this.props.newRequestCookies}
            newRequestBody={this.props.newRequestBody}
            setNewRequestCookies={this.props.setNewRequestCookies}
          />
        }
        {
          !this.props.newRequestFields.graphQL
          && this.props.newRequestFields.method !== 'GET'
          && !/wss?:\/\//.test(this.props.newRequestFields.protocol)
          &&
          <BodyEntryForm
            newRequestHeaders={this.props.newRequestHeaders}
            newRequestBody={this.props.newRequestBody}
            setNewRequestHeaders={this.props.setNewRequestHeaders}
            setNewRequestBody={this.props.setNewRequestBody}
          />
        }
        {
          this.props.newRequestFields.graphQL &&
          <GraphQLBodyEntryForm
            newRequestBody={this.props.newRequestBody}
            setNewRequestBody={this.props.setNewRequestBody}
          />
        }

        {/* SSE CHeckbox, update newRequestSSE in store */}
        {
          !this.props.newRequestFields.graphQL
          && !/wss?:\/\//.test(this.props.newRequestFields.protocol)
          && 
          <div class='composer_subtitle_SSE'>
            <input type="checkbox" onChange={this.handleSSEPayload} checked={this.props.newRequestSSE.isSSE}/>
            Server Sent Events
          </div>
        }

        <button className={SubmitButtonClassName} onClick={this.addNewRequest} type="button">
          Add New Request
        </button>
      </div>
    );
  }
}

export default ComposerNewRequest;
