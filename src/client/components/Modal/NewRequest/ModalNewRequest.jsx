import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuid/v4"

import * as actions from '../../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';
import BodyEntryForm from "./BodyEntryForm.jsx";
import dbController from '../../../controllers/dbController'

import ProtocolSelect from "./ProtocolSelect.jsx";

const mapStateToProps = store => ({
  newResponseFields : store.business.newResponseFields,
  newRequestHeaders : store.business.newRequestHeaders,
  newRequestBody : store.business.newRequestBody,
  currentTab : store.business.currentTab,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  setWarningModalMessage : (message) => {
    dispatch(actions.setWarningModalMessage(message));
  },
  setModalDisplay : (modalDisplay) => {
    dispatch(actions.setModalDisplay(modalDisplay));
  },
  setNewRequestFields : (requestObj) => {
    dispatch(actions.setNewRequestFields(requestObj));
  },
  setNewRequestHeaders : (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestBody : (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

class ModalNewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method : 'GET',
      protocol : 'http://',
      url : 'http://',
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.addNewRequest = this.addNewRequest.bind(this);
  }

  componentDidMount () {
    this.setState(this.props.newResponseFields)
  }

  componentDidUpdate () {
    // console.log('ModalNewReqest begin cDU');
    if(JSON.stringify(this.state) !== JSON.stringify(this.props.newResponseFields)){
      // console.log('ModalNewRequest begin diff');
      if (this.props.newResponseFields.override) {
        // console.log('ModalNewRequest store override');
        this.props.newResponseFields.override = false;
        this.setState(this.props.newResponseFields)
      } 
      else { 
        // console.log('ModalNewRequest state priority');
        this.props.setNewRequestFields(this.state) 
      }
    }
  }

  onChangeHandler(e, property) {
    let value = e.target.value;
    this.setState({
      [property]: property === 'url' 
      ? this.state.protocol + e.target.value.replace(/(h?.?t?.?t?.?p?.?s?.?|w?.?s?.?)(:[^\/]?\/?.?\/?)/, '') 
      : e.target.value,
    }, () => {
      if(property === 'protocol') {
        this.setState ({
          'url' : this.state.protocol + this.state.url.replace(/(h?t?t?p?s?|w?s?):\/?\/?/, ''),
        });
      } else if (property === 'method' && value === 'GET') {
        this.props.setNewRequestBody ({
          ...this.props.newRequestBody,
          bodyContent : '',
        })
      }
    }) 
  };

  requestValidationCheck () {
    let validationMessage = undefined;

    //Error conditions...
    if(this.state.url === 'http://' || this.state.url === 'https://' || this.state.url === 'ws://') {
      validationMessage = "Please enter a valid URI.";
    }
    else if (!this.props.newRequestBody.JSONFormatted && this.state.contentTypeHeader === 'application/json'){
      validationMessage = "Please fix JSON body formatting errors.";
    }
    return validationMessage ? validationMessage : true;
  }

  addNewRequest() {
    let validated = this.requestValidationCheck();

    if (validated === true) {
      let reqRes;
      //HTTP REQUESTS
      if(this.state.protocol !== 'ws://'){
        let URIWithoutProtocol = this.state.url.split(this.state.protocol)[1] + '/';
        if (URIWithoutProtocol.charAt(URIWithoutProtocol.length-1) !== '/') {
          URIWithoutProtocol = URIWithoutProtocol + '/';
        }
        let host = this.state.protocol + URIWithoutProtocol.split('/')[0];
        let path = '/' + URIWithoutProtocol.split('/').splice(1).join('/').replace(/\/{2,}/g, '/');
        if (path.charAt(path.length - 1) === '/' && path.length >1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/https?:\//g,'http://')

        reqRes = {
          id : uuid(), // Math.floor(Math.random() * 100000),
          created_at : new Date,
          protocol : this.state.protocol,
          host : host,
          path : path,
          url : this.state.url,
          timeSent : null,
          timeReceived : null,
          connection : 'uninitialized',
          connectionType : null,
          checkSelected : false,
          request: {
            method : this.state.method,
            headers : this.props.newRequestHeaders.headersArr,
            body : this.props.newRequestBody.bodyContent,
            bodyType: this.props.newRequestBody.bodyType,
            rawType: this.props.newRequestBody.rawType
          },
          response : {
            headers : null,
            events : null,
          },
          checked : false,
          tab : this.props.currentTab,
        };
      }
      //WEBSOCKET REQUESTS 
      else {
        reqRes = {
          id : uuid(), // Math.floor(Math.random() * 100000),
          created_at : new Date,
          protocol : this.state.protocol,
          url : this.state.url,
          timeSent : null,
          timeReceived : null,
          connection : 'uninitialized',
          connectionType : 'WebSocket',
          checkSelected : false,
          request: {
            method: 'WS',
            messages : [],
          },
          response : {
            messages : [],
          },
          checked : false,
          tab : this.props.currentTab,
        };
      }

      dbController.addToHistory(reqRes);
      this.props.reqResAdd(reqRes);

      //reset for next request
      this.props.setNewRequestHeaders({
        headersArr : [],
        count : 0,
      });

      this.setState({
        method : 'GET',
        protocol : 'http://',
        bodyType : 'none',
        rawType : 'Text (text/plain)',
        body : '',
        url : 'http://',
        JSONFormatted : true,
      }, () => {
        // console.log('after clearing', this.state);
      });
    } 
    else {
      this.props.setWarningModalMessage(validated);
      this.props.setModalDisplay('Warning');
    }
  }

  render() {
    // console.log('ModalNewRequest Begin Render', this.state);

    let HTTPMethodStyle = {
      display : this.state.protocol !== 'ws://' ? 'block' : 'none',
    }
    let HeaderEntryFormStyle = {
      display : this.state.protocol !== 'ws://' ? 'block' : 'none',
    }
    let BodyEntryFormStyle = {
      'display' : (this.state.method !== 'GET' && this.state.protocol !== 'ws://') ? 'flex' : 'none',
      'flexDirection' : 'column'
    }

    return(
      <div style={{'display' : 'flex', 'flexDirection' : 'column'}} onKeyPress={event => {
        if (event.key === 'Enter') {
          this.addNewRequest();
        }
      }}>
        <h1 className={'sidebar_title'}>Create New Request</h1>

        <ProtocolSelect currentProtocol={this.state.protocol} onChangeHandler={this.onChangeHandler}/>

        <select style={HTTPMethodStyle} value={this.state.method} className={'HTTPMethodStyle modal_select'} onChange={(e) => {
          this.onChangeHandler(e, 'method')
        }}>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>

        <input className={'modal_url-input'} type='text' placeholder='URL' value={this.state.url} onChange={(e) => {
          this.onChangeHandler(e, 'url')
        }}></input>
        
        <HeaderEntryForm 
          stylesObj={HeaderEntryFormStyle} 
        />
        
        <BodyEntryForm 
          stylesObj={BodyEntryFormStyle} 
        />

        <button className={'modal_submit'} onClick={this.addNewRequest}>Add New Request</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalNewRequest);
