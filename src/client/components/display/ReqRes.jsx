import React, { Component } from "react";
import { connect } from 'react-redux';
import Request from './Request.jsx';
import ResponseContainer from '../containers/ResponseContainer.jsx';
import OpenBtn from './OpenBtn.jsx';
import CloseBtn from './CloseBtn.jsx';
import 'status-indicator/styles.css'
import ReqResCtrl from '../ReqResCtrl';

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
    contentBody.push(<Request content={this.props.content.request} key={0}/>);
    if (this.props.content.connection !== 'uninitialized') {
      contentBody.push(<ResponseContainer content={this.props.content.response} connectionType={this.props.content.connectionType} key={1}/>)
    };

    return(
      <div className={"resreq_wrap"} style={{'border' : '1px solid red', 'margin' : '10px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        {/* ReqRes */}
      

      <div className={'nested-grid-8'}>
        <div>
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

        <OpenBtn content={this.props.content} connectionStatus={this.props.content.connection}/>
        <CloseBtn content={this.props.content} connectionStatus={this.props.content.connection}/>
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReqRes);

