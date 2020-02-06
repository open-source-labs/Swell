import React, { Component } from 'react';
import historyController from '../../controllers/historyController';
import Trashcan from '../../../assets/img/Trashcan.png';

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
      graphQL: this.props.content.graphQL ? this.props.content.graphQL : false,
      gRPC: this.props.content.gRPC ? this.props.content.gRPC : false
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
    if (this.props.content.request.cookies && !/ws/.test(this.props.content.protocol && !this.content.gRPC)) {
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
    // set the streamContent arr to equal each query in the streamsArr
    const streamsArr = this.props.content.streamsArr;
    const streamContent = [];
    for (const stream of streamsArr) {
      streamContent.push(stream.query);
    }
    // construct the streams obj from passed in history content & set state in store
    const requestStreamsObj = {
      streamsArr,
      count: this.props.content.queryArr.length,
      streamContent,
      selectedPackage: this.props.content.packageName,
      selectedRequest: this.props.content.rpc,
      selectedService:  this.props.content.service,
      selectedStreamingType: this.props.content.request.method,
      initialQuery: this.props.content.initialQuery,
      queryArr: this.props.content.queryArr,
      protoPath: this.props.content.protoPath,
      services: this.props.content.servicesObj
    }
    this.props.setNewRequestFields(requestFieldObj);
    this.props.setNewRequestHeaders(requestHeadersObj);
    this.props.setNewRequestCookies(requestCookiesObj);
    this.props.setNewRequestBody(requestBodyObj);
    this.props.setNewRequestStreams(requestStreamsObj)
    // for gRPC 
    if (this.props.content.gRPC) {
      // need to place logic in callback otherwise code won't work and returns null
      this.setState({
        ...this.state
      }, () => {
        // grab the dropdown lists and set its selected value to equal what is in the history
        const dropdownService = document.getElementById('dropdownService').options;
        for (const option of dropdownService) {
          if (option.text === this.props.content.service) {
            option.selected = true;
          }
        }
        const dropdownRequest = document.getElementById('dropdownRequest').options;
        for (const option of dropdownRequest) {
          if (option.text === this.props.content.rpc) {
            option.selected = true;
          }
        }
        // update streaming type button displayed next to the URL
        document.getElementById('stream').innerText = this.props.content.request.method;
      })
    }
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