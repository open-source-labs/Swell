import React, { Component } from 'react';
import connectionController from '../../controllers/reqResController';
import OpenBtn from '../display/OpenBtn.jsx';
import CloseBtn from '../display/CloseBtn.jsx';
import RequestTabs from '../display/RequestTabs.jsx';
import ResponseContainer from './ResponseContainer.jsx';
import WebSocketWindow from '../display/WebSocketWindow.jsx';
import dropDownArrow from '../../../assets/icons/arrow_drop_down_white_192x192.png'

class SingleReqResContainer extends Component {
  constructor(props) {
    super(props);
    this.removeReqRes = this.removeReqRes.bind(this);
    this.onCheckHandler = this.onCheckHandler.bind(this);
    this.minimize = this.minimize.bind(this);
    this.toggleBatch = this.toggleBatch.bind(this);
    this.incrementBatchCount = this.incrementBatchCount.bind(this);
    this.decrementBatchCount = this.decrementBatchCount.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  onCheckHandler() {
    this.props.content.checked = !this.props.content.checked;
    this.props.reqResUpdate(this.props.content);
  }
  
  toggleBatch() {
    if(/http|https$/.test(this.props.content.protocol) ){
      this.props.content.isThisBatchCall = !this.props.content.isThisBatchCall;
      this.props.reqResUpdate(this.props.content);
    }
  }
  incrementBatchCount(){
    this.props.content.batchCount++
    this.props.reqResUpdate(this.props.content);

  }
  decrementBatchCount(){
    if(this.props.content.batchCount > 0){
      this.props.content.batchCount--
      this.props.reqResUpdate(this.props.content);
    }
  }
  changeHandler(e){
    this.props.content.batchCount = e.target.value
      
        this.props.reqResUpdate(this.props.content);
    
  }

  removeReqRes() {
    connectionController.closeReqRes(this.props.content.id);
    this.props.reqResDelete(this.props.content);
  }

  minimize() {
    this.props.content.minimized = !this.props.content.minimized;
    this.props.reqResUpdate(this.props.content);
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
        contentBody.push(<ResponseContainer
          content={this.props.content}
          connectionType={this.props.content.connectionType}
          reqResUpdate={this.props.reqResUpdate}
          key={1}
        />)
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

    const arrowClass = !this.props.content.minimized ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    let loadingBatch = (this.props.content.connection === 'pending' || this.props.content.connection === 'open')  && this.props.content.isThisBatchCall
    return (
      <div>
        <div className="resreq_wrap" id={this.props.content.id}>
            <div className="title-row">
              <span className="primary-title highlighter title_reverse-offset" onClick={this.minimize}>
                <span><img className={arrowClass} src={dropDownArrow}>
                </img></span>
                <pre><p>  </p></pre>
                {this.props.content.request.method}</span>
              <span className="primary-title ">{this.props.content.url}</span>
            </div>
  {/* -------------------------------------------------------- */}
    {/* Conditionally Render loading screen for batch requests */}
  {/* -------------------------------------------------------- */}
        { loadingBatch ? <div className ="batch-loading_wrap"><h1 id="batchlog-counter">{this.props.content.batchlogCounter}</h1><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div> : 
            //----------------------------------------
            //Contitionally minimize the current reqRescontainer
            //----------------------------------------
            !this.props.content.minimized &&
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
                    <OpenBtn stylesObj={openButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection} reqResUpdate={this.props.reqResUpdate}/>
                    <CloseBtn stylesObj={closeButtonStyles} content={this.props.content} connectionStatus={this.props.content.connection} />
                  </div>
                  <div className="btn-sm">
                    <button type="button" className="btn resreq_remove" onClick={this.removeReqRes}>Remove</button>
                  </div>
                  <div>{statusLight}</div>
                  <span className="tertiary-title">{this.props.content.connectionType}</span>


                  <span className="tertiary-title roundtrip" title="The amount of time it takes to recieve response">
                    Roundtrip: {this.props.content.timeReceived === null ? '0' : this.props.content.timeReceived - this.props.content.timeSent} ms
                  </span>


                  {/* ----------------------------------------------------------------------------------- */}
                  {/* Only allow batchcalls for request matching https://... sry http no batch for you */}
                  {/* ----------------------------------------------------------------------------------- */}
                  {this.props.content.protocol === "https://"? 
                      <span className = "batchcall-container">
                        <label id="batch-label" htmlFor="batchbox">Batch Call</label>
                        <input type="checkbox" checked={this.props.content.isThisBatchCall} id= 'batchbox' className="togglebatch" onChange={this.toggleBatch}></input>
                      </span>
                  :<></>} 
                </div>


                  {/* ----------------------------------------------------------------------------------- */}
                  {/* Only allow user to edit batchcount if the current request batchcheckbox is ticked */}
                  {/* ----------------------------------------------------------------------------------- */}
                  {this.props.content.isThisBatchCall?
                      <div className= 'batchController'>
                        <input id="current-batch-count" type="text" value={this.props.content.batchCount} onChange={this.changeHandler}></input>
                        <button onClick={this.incrementBatchCount}>↑</button>
                        <button onClick={this.decrementBatchCount}>↓</button>
                      </div>
                  :<></>}
                <div style={errorStyles} className="networkerror">There was a network error in connecting to endpoint.</div>
                {contentBody}
              </div>              
        }
  {/* -------------------------------------------------------- */}
  {/* -------------------------------------------------------- */}

      </div> 
    </div>

        
    )
};}

export default SingleReqResContainer;
