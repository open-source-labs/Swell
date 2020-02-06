import React, { Component } from 'react';
import historyController from '../../controllers/historyController';
import Trashcan from '../../../assets/img/Trashcan.png'

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.addHistoryToNewRequest = this.addHistoryToNewRequest.bind(this);
    this.deleteHistory = this.deleteHistory.bind(this);
  }

  addHistoryToNewRequest() {
    // console.log('this is the content', this.props.content)
    const requestFieldObj = {
      method: this.props.content.request.method ? this.props.content.request.method : 'GET',
      protocol: this.props.content.protocol ? this.props.content.protocol : 'http://',
      url: this.props.content.url ? this.props.content.url : 'http://',
      graphQL: this.props.content.graphQL ? this.props.content.graphQL : false,
      gRPC: this.props.content.protocol === '' ? true : false
    }
    let headerDeeperCopy;
    if (this.props.content.request.headers) {
      headerDeeperCopy = JSON.parse(JSON.stringify(this.props.content.request.headers));
      headerDeeperCopy.push({
        id: this.props.content.request.headers.length + 1,
        active: false,
        key: '',
        value: '',
      })
    }
    let cookieDeeperCopy;
    if (this.props.content.request.cookies && !/ws/.test(this.props.content.protocol)) {
      cookieDeeperCopy = JSON.parse(JSON.stringify(this.props.content.request.cookies));
      cookieDeeperCopy.push({
        id: this.props.content.request.cookies.length + 1,
        active: false,
        key: '',
        value: '',
      })
    }
    const requestHeadersObj = {
      headersArr: headerDeeperCopy ? headerDeeperCopy : [],
      count: headerDeeperCopy ? headerDeeperCopy.length : 1,
    }
    const requestCookiesObj = {
      cookiesArr: cookieDeeperCopy ? cookieDeeperCopy : [],
      count: cookieDeeperCopy ? cookieDeeperCopy.length : 1,
    }
    const requestBodyObj = {
      bodyType: this.props.content.request.bodyType ? this.props.content.request.bodyType : 'none',
      bodyContent: this.props.content.request.body ? this.props.content.request.body : '',
      bodyVariables: this.props.content.request.bodyVariables ? this.props.content.request.bodyVariables : '',
      rawType: this.props.content.request.rawType ? this.props.content.request.rawType : 'Text (text/plain)',
      JSONFormatted: this.props.content.request.JSONFormatted ? this.props.content.request.JSONFormatted : true,
      protoContent: this.props.content.request.protoContent
    }
    // const requestStreamsObj = {
    //   streamsArr: this.props.content.streamsArr,
    //   count: this.props.content.count,
    //   streamContent: this.props.streamContent,
    //   selectedPackage: this.props.selectedPackage,
    //   selectedRequest: this.props.selectedRequest,
    //   selectedService: this.props.selectedService,
    //   selectedStreamingType: this.props.selectedStreamingType,
    //   initialQuery: this.props.initialQuery,
    //   queryArr: this.props.queryArr,
    //   protoPath: this.props.protoPath,
    //   services: this.props.services
    // }

    this.props.setNewRequestFields(requestFieldObj);
    this.props.setNewRequestHeaders(requestHeadersObj);
    this.props.setNewRequestCookies(requestCookiesObj);
    this.props.setNewRequestBody(requestBodyObj);
    // this.props.setNewRequestStreams(requestStreamsObj)
  }

  deleteHistory(e) {
    this.props.deleteFromHistory(this.props.content);
    historyController.deleteHistoryFromIndexedDb(e.target.id);
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