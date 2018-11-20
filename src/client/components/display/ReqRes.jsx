import React, { Component } from "react";
import { connect } from 'react-redux';
import Request from './Request.jsx';
import ResponseContainer from '../containers/ResponseContainer.jsx';
import OpenBtn from './OpenBtn.jsx';
import CloseBtn from './CloseBtn.jsx';
import WebSocketWindow from "./WebSocketWindow.jsx";
import 'status-indicator/styles.css'

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
    // ReqResCtrl.closeEndPoint(this.props.content.id); 
    this.props.reqResDelete(this.props.content);
  }

  render() {
    let contentBody = [];

    if(this.props.content.protocol === 'ws://') {
      contentBody.push(<WebSocketWindow key={0} >WS</WebSocketWindow>)
    } else {
      contentBody.push(<Request content={this.props.content.request} key={0}/>);
      if (this.props.content.connection !== 'uninitialized') {
        contentBody.push(<ResponseContainer content={this.props.content.response} connectionType={this.props.content.connectionType} key={1}/>)
      };
    }

   

    let openButtonStyles = {
      display : (this.props.content.connection === 'uninitialized' || this.props.content.connection === 'closed') ? 'block' : 'none',
    }
    let closeButtonStyles = {
      display : (this.props.content.connection === 'pending' || this.props.content.connection === 'open') ? 'block' : 'none',
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
    }

    return(
      <div className="resreq_component" style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ReqRes

        <input 
        id={this.props.content.id} checked={this.props.content.checked}
        className="resreq-select" type="checkbox" 
        onChange={this.onCheckHandler}
        />

        <button onClick={this.removeReqRes}>Remove</button>
        
        {this.props.content.id}
        {this.props.content.url}
        {this.props.content.timeSent}
        {this.props.content.timeReceived}
        {this.props.content.connectionType}
        {statusLight}
        {contentBody}

        <OpenBtn stylesObj={openButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection}/>
        <CloseBtn stylesObj={closeButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection}/>
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReqRes);

