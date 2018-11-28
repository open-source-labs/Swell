import React, { Component } from 'react';
import { connect } from 'react-redux';
import Request from './Request.jsx';
import ResponseContainer from '../containers/ResponseContainer.jsx';
import OpenBtn from './OpenBtn.jsx';
import CloseBtn from './CloseBtn.jsx';
import WebSocketWindow from './WebSocketWindow.jsx';
import connectionController from '../../controllers/connectionController';
// import 'status-indicator/styles.css'

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({
  reqResDelete: (reqRes) => {
    dispatch(actions.reqResDelete(reqRes));
  },
  reqResUpdate: (reqRes) => {
    dispatch(actions.reqResUpdate(reqRes));
  },
});

class ReqRes extends Component {
  constructor(props) {
    super(props);
    this.removeReqRes = this.removeReqRes.bind(this);
    this.onCheckHandler = this.onCheckHandler.bind(this);
  }

  onCheckHandler() {
    this.props.content.checked = !this.props.content.checked;
    this.props.reqResUpdate(this.props.content);
  }

  removeReqRes() {
    connectionController.closeReqRes(this.props.content.id);
    this.props.reqResDelete(this.props.content);
  }

  render() {
    const contentBody = [];
    // let resReqContainer = document.querySelector('.resreq_res-container');
    // resReqContainer[0].scrollTop = resReqContainer[0].scrollHeight;

    if (this.props.content.protocol === 'ws://') {
      contentBody.push(
        <WebSocketWindow
          key={0}
          outgoingMessages={this.props.content.request.messages}
          incomingMessages={this.props.content.response.messages}
          id={this.props.content.id}
          connection={this.props.content.connection}
        />,
      );
    } else {
      console.log('>>>>>>>>>> FOOO');
      contentBody.push(<Request content={this.props.content.request} key={0} />);
      if (this.props.content.connection !== 'uninitialized') {
        contentBody.push(
          <ResponseContainer
            content={this.props.content.response}
            connectionType={this.props.content.connectionType}
            key={1}
          />,
        );
      }
    }

    const openButtonStyles = {
      display:
        this.props.content.connection === 'uninitialized'
        || this.props.content.connection === 'closed'
        || this.props.content.connection === 'error'
          ? 'block'
          : 'none',
    };
    const closeButtonStyles = {
      display:
        this.props.content.connection === 'pending' || this.props.content.connection === 'open'
          ? 'block'
          : 'none',
    };
    const errorStyles = {
      display: this.props.content.connection === 'error' ? 'block' : 'none',
      color: 'red',
    };
    const http2Display = {
      display: this.props.content.isHTTP2 ? 'block' : 'none',
      color: 'green',
      border: '1px solid black',
    };

    let statusLight;
    switch (this.props.content.connection) {
      case 'uninitialized':
        statusLight = <status-indicator />;
        break;
      case 'pending':
        statusLight = <status-indicator intermediary pulse />;
        break;
      case 'open':
        statusLight = <status-indicator positive pulse />;
        break;
      case 'closed':
        statusLight = <status-indicator negative />;
        break;
      case 'error':
        statusLight = <status-indicator negative />;
        break;
      default:
        console.log('not a valid connection for content object');
    }

    return (
      <div className="resreq_wrap">
        {/* ReqRes */}

        <div className="title-row">
          <div>
            <span className="primary-title">{this.props.content.request.method}</span>

            <span className="primary-title">
              {' '}
              {this.props.content.url}
            </span>
          </div>
        </div>

        <div className="nested-grid-6">
          <div>
            <div style={errorStyles}>There was a network error in connecting to endpoint.</div>
            <input
              id={this.props.content.id}
              checked={this.props.content.checked}
              className="resreq_select-radio"
              name="resreq-select"
              type="checkbox"
              onChange={this.onCheckHandler}
            />
          </div>
          <div className="btn-sm">
            <OpenBtn
              stylesObj={openButtonStyles}
              content={this.props.content}
              connectionStatus={this.props.content.connection}
            />
            <CloseBtn
              stylesObj={closeButtonStyles}
              content={this.props.content}
              connectionStatus={this.props.content.connection}
            />
          </div>
          <button className="btn-sm resreq_remove" onClick={this.removeReqRes} type="button">
            Remove
          </button>
          <div>{statusLight}</div>
          <div>
            <span className="tertiary-title">{this.props.content.connectionType}</span>
          </div>
          <div>
            <span className="tertiary-title">
              Round Trip:
              {' '}
              {this.props.content.timeReceived - this.props.content.timeSent}
            </span>
          </div>
        </div>

        <div style={http2Display}>
          HTTP2 connection: Requests with the same host will share a single HTTP2 connection
        </div>

        {contentBody}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReqRes);
