import React, { Component } from "react";
import { connect } from 'react-redux';
import Request from './Request.jsx';
import ResponseContainer from '../containers/ResponseContainer.jsx';
import OpenBtn from './OpenBtn.jsx';
import CloseBtn from './CloseBtn.jsx';
import WebSocketWindow from "./WebSocketWindow.jsx";
import connectionController from '../../controllers/connectionController';
// import 'status-indicator/styles.css'

import * as actions from '../../actions/actions';


const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({
  reqResDelete: (reqRes) => {
    dispatch(actions.reqResDelete(reqRes));
  },
  reqResUpdate: (reqRes) => {
    dispatch(actions.reqResUpdate(reqRes));
  }
});

class ReqRes extends Component {
  constructor(props) {
    super(props);
    this.removeReqRes = this.removeReqRes.bind(this);
    this.onCheckHandler = this.onCheckHandler.bind(this);
  }

  onCheckHandler () {
    this.props.content.checked = !this.props.content.checked;
    this.props.reqResUpdate(this.props.content);
  }

  removeReqRes () {
    connectionController.closeReqRes(this.props.content.id); 
    this.props.reqResDelete(this.props.content);
  }

  render() {
    let contentBody = [];

    if(this.props.content.protocol === 'ws://') {
      contentBody.push(<WebSocketWindow 
        key={0} 
        outgoingMessages={this.props.content.request.messages}
        incomingMessages={this.props.content.response.messages}
        id={this.props.content.id} 
        connection={this.props.content.connection}/>)
    } else {
      contentBody.push(<Request content={this.props.content.request} key={0}/>);
      if (this.props.content.connection !== 'uninitialized') {
        contentBody.push(<ResponseContainer content={this.props.content.response} connectionType={this.props.content.connectionType} key={1}/>)
      };
    }

    let openButtonStyles = {
      display : (this.props.content.connection === 'uninitialized' || this.props.content.connection === 'closed' || this.props.content.connection === 'error') ? 'block' : 'none',
    }
    let closeButtonStyles = {
      display : (this.props.content.connection === 'pending' || this.props.content.connection === 'open') ? 'block' : 'none',
    }
    let errorStyles = {
      'display' : this.props.content.connection === 'error' ? 'block' : 'none',
      'color' : 'red',
    }

    let statusLight;
    switch (this.props.content.connection) {
      case 'uninitialized' :
        statusLight = <status-indicator></status-indicator>
        break;
      case 'pending' :
        statusLight = <status-indicator intermediary pulse></status-indicator>
        break;
      case 'open' :
        statusLight = <status-indicator positive pulse></status-indicator>
        break;
      case 'closed' :
        statusLight = <status-indicator negative></status-indicator>
        break;
      case 'error' :
        statusLight = <status-indicator negative></status-indicator>
        break;
    }

    return(
      <div className={"resreq_wrap"} style={{'border' : '1px solid red', 'margin' : '10px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        {/* ReqRes */}
      

      <div className={'nested-grid-8'}>
        <div>
          <div style={errorStyles}>There was a network error in connecting to endpoint.</div>
          <input 
            id={this.props.content.id} checked={this.props.content.checked}
            className="resreq_select-radio" name='resreq-select' type="checkbox" 
            onChange={this.onCheckHandler}
          />
          {/* <label className={'resreq_select-radio-label'} for="resreq-select">Select</label> */}
        </div>
        <button className={'btn-sm resreq_remove'} onClick={this.removeReqRes}>Remove</button>
        <div>{statusLight}</div>
        <div><span className={'tertiary-title'}>{this.props.content.connectionType}</span></div>
        <div><span className={'tertiary-title'}>RESPONSE ID: {this.props.content.id}</span></div>
        <div><span className={'tertiary-title'}>URL:{this.props.content.url}</span></div>
        <div><span className={'tertiary-title'}>Request Sent: {this.props.content.timeSent}</span></div>
        <div><span className={'tertiary-title'}>Response Recieved: {this.props.content.timeReceived}</span></div>
      </div>

 
        {contentBody}

        <OpenBtn stylesObj={openButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection}/>
        <CloseBtn stylesObj={closeButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection}/>
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReqRes);

