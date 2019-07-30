import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponseContainer from '../containers/ResponseContainer.jsx';
import OpenBtn from './OpenBtn.jsx';
import CloseBtn from './CloseBtn.jsx';
import WebSocketWindow from './WebSocketWindow.jsx';
import connectionController from '../../controllers/reqResController';
import RequestTabs from './RequestTabs.jsx';

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
    this.toggleShow = this.toggleShow.bind(this);
    this.state = {
      show: true
    }
  }

  onCheckHandler() {
    this.props.content.checked = !this.props.content.checked;
    this.props.reqResUpdate(this.props.content);
  }

  removeReqRes() {
    connectionController.closeReqRes(this.props.content.id);
    this.props.reqResDelete(this.props.content);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  render() {

    const contentBody = [];

    if (this.props.content.protocol === 'ws://') {
      contentBody.push(<WebSocketWindow
        key={0}
        outgoingMessages={this.props.content.request.messages}
        incomingMessages={this.props.content.response.messages}
        id={this.props.content.id}
        connection={this.props.content.connection}
      />);
    }
    else {
      contentBody.push(<RequestTabs requestContent={this.props.content.request} key={0} />)
      if (this.props.content.connection !== 'uninitialized') {
        contentBody.push(<ResponseContainer content={this.props.content.response} connectionType={this.props.content.connectionType} key={1} />)
      }
    }

    const openButtonStyles = {
      display: (this.props.content.connection === 'uninitialized' || this.props.content.connection === 'closed' || this.props.content.connection === 'error') ? 'block' : 'none',
    };

    const closeButtonStyles = {
      display: (this.props.content.connection === 'pending' || this.props.content.connection === 'open') ? 'block' : 'none',
    };

    const errorStyles = {
      display: this.props.content.connection === 'error' ? 'block' : 'none',
      color: 'red',
    };

    const http2Display = {
      display: this.props.content.isHTTP2 ? 'block' : 'none',
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

    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';

    return (
      <div className="resreq_wrap" id={this.props.content.id}>
        <div className="title-row">
          <span className="primary-title highlighter title_reverse-offset" onClick={this.toggleShow}>
            <span><img className={arrowClass} src='https://www.materialui.co/materialIcons/navigation/arrow_drop_down_white_192x192.png'>
            </img></span>
            <pre><p>  </p></pre>
            {this.props.content.request.method}</span>
          <span className="primary-title ">{this.props.content.url}</span>
        </div>

        {
          this.state.show &&
          <div>
            <div className="grid-6">
              <div>
                <input
                  id={this.props.content.id}
                  checked={this.props.content.checked}
                  className="reqres_select-radio"
                  name="resreq-select"
                  type="checkbox"
                  onChange={this.onCheckHandler}
                />
              </div>

              <div className="btn-sm">
                <OpenBtn stylesObj={openButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection} />
                <CloseBtn stylesObj={closeButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection} />
              </div>
              <div className="btn-sm">
                <button type="button" className="btn resreq_remove" onClick={this.removeReqRes}>Remove</button>
              </div>
              <div>{statusLight}</div>
              <span className="tertiary-title">{this.props.content.connectionType}</span>


              <span className="tertiary-title">
                {/* kajol - we have to figure out if timeReceived gives the right latency value  */}
                Roundtrip: {this.props.content.timeReceived === null ? '0' : this.props.content.timeReceived - this.props.content.timeSent}
              </span>
            </div>


            <div style={http2Display} className={'httptwo'}>
              HTTP2 connection: Requests with the same host will share a single HTTP2 connection.
        </div>

            <div style={errorStyles} className="networkerror">There was a network error in connecting to endpoint.</div>
            {contentBody}
          </div>
        }

      </div>

    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReqRes);
