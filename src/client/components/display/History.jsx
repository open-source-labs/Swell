import React, { Component } from 'react';
import dbController from '../../controllers/dbController';
import Trashcan from '../../../assets/img/Trashcan.png'

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.addHistoryToNewRequest = this.addHistoryToNewRequest.bind(this);
    this.deleteHistory = this.deleteHistory.bind(this);
  }

  addHistoryToNewRequest() {
    const requestFieldObj = {
      method: this.props.content.request.method ? this.props.content.request.method : 'GET',
      protocol: this.props.content.protocol ? this.props.content.protocol : 'http://',
      url: this.props.content.url ? this.props.content.url : 'http://',
      graphQL: this.props.content.graphQL ? this.props.content.graphQL : false
    }

    let deeperCopy;
    if (this.props.content.request.headers) {
      deeperCopy = JSON.parse(JSON.stringify(this.props.content.request.headers));
      deeperCopy.push({
        id: this.props.content.request.headers.length + 1,
        active: false,
        key: '',
        value: '',
      })
    }
    const requestHeadersObj = {
      headersArr: deeperCopy ? deeperCopy : [],
      count: this.props.content.request.headers ? this.props.content.request.headers.length : 0,
    }
    const requestCookiesObj = {
      cookiesArr: this.props.content.request.cookies ? this.props.content.request.cookies : [],
      count: this.props.content.request.cookies ? this.props.content.request.cookies.length : 0,
    }
    const requestBodyObj = {
      bodyType: this.props.content.request.bodyType ? this.props.content.request.bodyType : 'none',
      bodyContent: this.props.content.request.body ? this.props.content.request.body : '',
      bodyVariables: this.props.content.request.bodyVariables ? this.props.content.request.bodyVariables : '',
      rawType: this.props.content.request.rawType ? this.props.content.request.rawType : 'Text (text/plain)',
      JSONFormatted: this.props.content.request.JSONFormatted ? this.props.content.request.JSONFormatted : true,
    }

    this.props.setNewRequestFields(requestFieldObj);
    this.props.setNewRequestHeaders(requestHeadersObj);
    this.props.setNewRequestCookies(requestCookiesObj);
    this.props.setNewRequestBody(requestBodyObj);
  }

  deleteHistory(e) {
    this.props.deleteFromHistory(this.props.content);
    dbController.deleteFromIndexDb(e.target.id);
  }


  render() {
    return (
      <div className={'history-container'} onClick={this.props.focusOnForm} >
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

export default History;