import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

import * as actions from '../../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';
import BodyEntryForm from "./BodyEntryForm.jsx";
import FieldEntryForm from "./FieldEntryForm.jsx";
import CookieEntryForm from './CookieEntryForm.jsx';
import dbController from '../../../controllers/dbController'

const mapStateToProps = store => ({
  newRequestFields : store.business.newRequestFields,
  newRequestHeaders : store.business.newRequestHeaders,
  newRequestBody : store.business.newRequestBody,
  newRequestCookies : store.business.newRequestCookies,
  currentTab : store.business.currentTab,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  setWarningModalMessage: (message) => {
    dispatch(actions.setWarningModalMessage(message));
  },
  setModalDisplay: (modalDisplay) => {
    dispatch(actions.setModalDisplay(modalDisplay));
  },

  setNewRequestHeaders : (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestFields : (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody : (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
  setNewRequestCookies : (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
});

class ModalNewRequest extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   method : 'GET',
    //   protocol : 'http://',
    //   url : 'http://',
    // };

    // this.onChangeHandler = this.onChangeHandler.bind(this);
    this.addNewRequest = this.addNewRequest.bind(this);
  }

  requestValidationCheck() {
    let validationMessage;

    //Error conditions...
    if(this.props.newRequestFields.url === 'http://' || this.props.newRequestFields.url === 'https://' || this.props.newRequestFields.url === 'ws://') {
      validationMessage = "Please enter a valid URI.";
    }
    else if (!this.props.newRequestBody.JSONFormatted && this.props.newRequestBody.rawType === 'application/json'){
      validationMessage = "Please fix JSON body formatting errors.";
    }
    return validationMessage || true;
  }

  addNewRequest() {
    const validated = this.requestValidationCheck();

    if (validated === true) {
      let reqRes;
      
      // HTTP REQUESTS
      if (this.props.newRequestFields.protocol !== 'ws://') {
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

        reqRes = {

          id: uuid(), // Math.floor(Math.random() * 100000),
          created_at: new Date(),
          protocol: this.props.newRequestFields.protocol,
          host,
          path,
          url: this.props.newRequestFields.url,
          timeSent: null,
          timeReceived: null,
          connection: 'uninitialized',
          connectionType: null,
          checkSelected: false,

          request: {
            method : this.props.newRequestFields.method,
            headers : this.props.newRequestHeaders.headersArr.filter(header => header.active),
            body : this.props.newRequestBody.bodyContent,
            cookies : this.props.newRequestCookies.cookiesArr.filter(cookie => cookie.active),
            bodyType: this.props.newRequestBody.bodyType,
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
        headersArr : [],
        count : 0,
      });
      
      this.props.setNewRequestCookies({
        cookiesArr : [],
        count : 0,
      });

      this.props.setNewRequestBody({
        bodyContent : '',
        bodyType : 'none',
        rawType : 'Text (text/plain)',
        JSONFormatted : true,
      });

      this.props.setNewRequestFields({
        method : 'GET',
        protocol : 'http://',
        url : 'http://',
      })
    } 
    else {
      this.props.setWarningModalMessage(validated);
      this.props.setModalDisplay('Warning');
    }
  }

  render() {
    let HeaderEntryFormStyle = {
      display : this.props.newRequestFields.protocol !== 'ws://' ? 'block' : 'none',
    }
    let BodyEntryFormStyle = {
      'display' : (this.props.newRequestFields.method !== 'GET' && this.props.newRequestFields.protocol !== 'ws://') ? 'block' : 'none'
    }

    return (
      <div
        tabIndex={0}
        style={{ display: 'flex', flexDirection: 'column' }}
        onKeyPress={(event) => {
        }}
        >
        <h1 className="modal_title">Create New Request</h1>


        <FieldEntryForm />
        
        <HeaderEntryForm 
          stylesObj={HeaderEntryFormStyle} 
        />
        
        <BodyEntryForm 
          stylesObj={BodyEntryFormStyle} 
        />
        
        <CookieEntryForm/>

        <button className="modal_submit" onClick={this.addNewRequest} type="button">
          Add New Request
        </button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalNewRequest);
