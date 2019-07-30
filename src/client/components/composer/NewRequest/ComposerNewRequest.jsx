import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

import * as actions from '../../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';
import BodyEntryForm from "./BodyEntryForm.jsx";
import GraphQLBodyEntryForm from "./GraphQLBodyEntryForm.jsx";
import FieldEntryForm from "./FieldEntryForm.jsx";
import CookieEntryForm from './CookieEntryForm.jsx';
import dbController from '../../../controllers/dbController'

const mapStateToProps = store => ({
  newRequestFields: store.business.newRequestFields,
  newRequestHeaders: store.business.newRequestHeaders,
  newRequestBody: store.business.newRequestBody,
  newRequestCookies: store.business.newRequestCookies,
  currentTab: store.business.currentTab,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  setComposerWarningMessage: (message) => {
    dispatch(actions.setComposerWarningMessage(message));
  },
  setComposerDisplay: (composerDisplay) => {
    dispatch(actions.setComposerDisplay(composerDisplay));
  },

  setNewRequestHeaders: (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestFields: (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
  setNewRequestCookies: (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
});

class ComposerNewRequest extends Component {
  constructor(props) {
    super(props);
    this.addNewRequest = this.addNewRequest.bind(this);
  }


  requestValidationCheck() {
    let validationMessage;
    
    //Error conditions...
    if (this.props.newRequestFields.url === 'http://' || this.props.newRequestFields.url === 'https://' || this.props.newRequestFields.url === 'ws://') {
      validationMessage = "Please enter a valid URI.";
    }
    if (!(/(https?:\/\/)|(ws:\/\/)/).test(this.props.newRequestFields.url)) {
      validationMessage = "Please enter a valid URI.";
    }
    else if (!this.props.newRequestBody.JSONFormatted && this.props.newRequestBody.rawType === 'application/json') {
      validationMessage = "Please fix JSON body formatting errors.";
    }
    else if(this.props.newRequestFields.method ==="QUERY"){
      if(this.props.newRequestFields.url && !this.props.newRequestBody.bodyContent){
        validationMessage = "Missing body.";
      }
    }
    
    return validationMessage || true;
  }

  addNewRequest() {
    const validated = this.requestValidationCheck();

    if (validated === true) {
      let reqRes;
      console.log("LSKDJFSLDKFJLSDF", this.props.newRequestBody)

      // HTTP && GRAPHQL REQUESTS
      if (this.props.newRequestFields.protocol !== 'ws://') {
        // console.log("HERE IN ADDNEWREQUEST IN COMPOSERNEWREQUEST")
        // console.log("url----->", this.props.newRequestFields.url)
        // console.log("protocol----->", this.props.newRequestFields.url.match(/(https?:\/\/)|(ws:\/\/)/)[0])
        // // console.log("protocol----->", this.props.newRequestFields.url.match(/^https?:\/\//))
        // const meow = this.props.newRequestFields.url.match(/(https?:\/\/)|(ws:\/\/)/g)[0]
        // console.log("uri minus protocol ----->", this.props.newRequestFields.url.substring(meow.length, this.props.newRequestFields.url.length))
        let URIWithoutProtocol = `${this.props.newRequestFields.url.split(this.props.newRequestFields.protocol)[1]}/`;
        if (URIWithoutProtocol.charAt(URIWithoutProtocol.length - 1) !== '/') {
          URIWithoutProtocol += '/';
        }
        const host = this.props.newRequestFields.protocol + URIWithoutProtocol.split('/')[0];
        let path = `/${URIWithoutProtocol.split('/')
          .splice(1)
          .join('/')
          .replace(/\/{2,}/g, '/')}`;
        if (path.charAt(path.length - 1) === '/' && path.length > 1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/https?:\//g, 'http://');
        let historyBodyContent;
        if (document.querySelector('#gqlBodyEntryTextArea')) { historyBodyContent = document.querySelector('#gqlBodyEntryTextArea').value }
        else if (this.props.newRequestBody.bodyContent) { historyBodyContent = this.props.newRequestBody.bodyContent }
        else historyBodyContent = '';

        let historyBodyVariables;
        if (document.querySelector('#gqlVariableEntryTextArea')) { historyBodyVariables = document.querySelector('#gqlVariableEntryTextArea').value }
        else historyBodyVariables = '';
        reqRes = {

          id: uuid(), // Math.floor(Math.random() * 100000),
          created_at: new Date(),
          protocol: this.props.newRequestFields.url.match(/(https?:\/\/)|(ws:\/\/)/)[0],
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
            headers: this.props.newRequestHeaders.headersArr.filter(header => header.active),
            cookies: this.props.newRequestCookies.cookiesArr.filter(cookie => cookie.active),
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
          tab: this.props.currentTab,
        };
      }
      // WEBSOCKET REQUESTS
      else {
        reqRes = {
          id: uuid(), // Math.floor(Math.random() * 100000),
          created_at: new Date(),
          protocol: this.props.newRequestFields.protocol,
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

      // console.log(this.props);

      dbController.addToIndexDb(reqRes);
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
      })
    }
    else {
      this.props.setComposerWarningMessage(validated);
      this.props.setComposerDisplay('Warning');
    }
  }

  render() {
    let HeaderEntryFormStyle = { //trying to change style to conditional created strange duplication effect when continuously changing protocol
      display: this.props.newRequestFields.protocol !== 'ws://' ? 'block' : 'none',
    }
    let SubmitButtonClassName = "composer_submit";
    if (this.props.newRequestFields.protocol === "ws://") { SubmitButtonClassName += " ws" }
    else if (this.props.newRequestFields.graphQL) { SubmitButtonClassName += " gql" }
    else { SubmitButtonClassName += " http" }

    return (
      <div
        tabIndex={0}
        style={{ display: 'flex', flexDirection: 'column', outline: 'none' }}
        onKeyPress={(event) => {
        }}
      >
        <h1 className="composer_title">Create New Request</h1>


        <FieldEntryForm addRequestProp={this.addNewRequest} />


        <HeaderEntryForm
          stylesObj={HeaderEntryFormStyle} />

        <CookieEntryForm />

        {
          !this.props.newRequestFields.graphQL && this.props.newRequestFields.method !== 'GET' && this.props.newRequestFields.protocol !== 'ws://' &&
          <BodyEntryForm />
        }
        {
          this.props.newRequestFields.graphQL &&
          <GraphQLBodyEntryForm
          />
        }

        <button className={SubmitButtonClassName} onClick={this.addNewRequest} type="button">
          Add New Request
        </button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComposerNewRequest);
