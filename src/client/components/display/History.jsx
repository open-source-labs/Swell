import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions/actions';
import dbController from '../../controllers/dbController';
import Trashcan from '../../../assets/img/Trashcan.png'

const path = require('path');

const mapStateToProps = store => ({
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  reqResDelete: (reqRes) => {
    dispatch(actions.reqResDelete(reqRes));
  },
  deleteFromHistory: (reqRes) => {
    dispatch(actions.deleteFromHistory(reqRes))
  },
  setNewRequestFields : (requestObj) => {
    dispatch(actions.setNewRequestFields(requestObj));
  },
  setNewRequestHeaders : (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestCookies : (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
  setNewRequestBody : (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
})

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.addHistoryToNewRequest = this.addHistoryToNewRequest.bind(this); 
    this.deleteHistory = this.deleteHistory.bind(this);
  }

  addHistoryToNewRequest () {
    console.log(this.props);
    const requestFieldObj = {
      method : this.props.content.request.method ? this.props.content.request.method : 'GET',
      protocol : this.props.content.protocol ? this.props.content.protocol : 'http://',
      url : this.props.content.url ? this.props.content.url : 'http://',
    }
    const requestHeadersObj = {
      headersArr : this.props.content.request.headers ? this.props.content.request.headers : [],
      count : this.props.content.request.headers ? this.props.content.request.headers.length : 0,
    }
    const requestCookiesObj = {
      cookiesArr : this.props.content.request.cookies ? this.props.content.request.cookies : [],
      count : this.props.content.request.cookies ? this.props.content.request.cookies.length : 0,
    }
    const requestBodyObj = {
      bodyContent : this.props.content.request.body ? this.props.content.request.body : '',
      bodyType: this.props.content.request.bodyType ? this.props.content.request.bodyType : 'none',
      rawType: this.props.content.request.rawType ? this.props.content.request.rawType : 'Text (text/plain)',
      JSONFormatted : this.props.content.request.JSONFormatted ? this.props.content.request.JSONFormatted : true,
    }

    this.props.setNewRequestFields(requestFieldObj);
    this.props.setNewRequestHeaders(requestHeadersObj);
    this.props.setNewRequestCookies(requestCookiesObj);
    this.props.setNewRequestBody(requestBodyObj);
  }

  deleteHistory (e) {
    this.props.deleteFromHistory(this.props.content);
    dbController.deleteFromIndexDb(e.target.id);
  }


  render() {
    return(
      <div className={'history-container'} >
        <div className={'history-text-container'} onClick={this.addHistoryToNewRequest}> 
          <div className={'history-method'}>{this.props.content.request.method}
          </div>
          <div className={'history-url'}> {this.props.content.url}
          </div>
        </div>
        <div className='history-delete-container'>
          <div className='history-delete-fade'>
          </div>
          <div className={'history-delete-button'} onClick={this.deleteHistory}>
            <img className='history-delete-image' src={Trashcan} id={this.props.content.id} ></img>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History);