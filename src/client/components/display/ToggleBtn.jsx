import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';
import * as store from '../../store';
import * as actions from '../../actions/actions';

class ToggleBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
          // isClosed: true,
          prevContentBody: [],
          abortController : null
        };
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.abortStateSet = this.abortStateSet.bind(this);
      }

      abortStateSet() {
        this.setState({
          abortController : new AbortController(),
        }, () => {
          ReqResCtrl.cacheAbortObject(this.state.abortController);
        });
      }

      componentDidMount(props) {
        this.setState({
          abortController : new AbortController(),
        }, () => {
          ReqResCtrl.cacheAbortObject(
            {
              abortController: this.state.abortController,
              reqResID: this.props.reqResState.content.id
            });
          ReqResCtrl.callbackFunctionArray.push(this.abortStateSet)
        })
      }

      handleToggleClick(e, abortCtrl) {
        /* On Click if Toggle isn't open yet, OPEN IT*/
        if (this.props.connectionStatus !== 'open') {
          ReqResCtrl.toggleOpenEndPoint(e.target.id, this.state.abortController);
        /* Else CLOSE IT */
        } else {
          const reqResComponentID = e.target.id;
          const gotState = store.default.getState();
          const reqResArr = gotState.business.reqResArray;
          const targetReqResObj = reqResArr.find(obj => obj.id == reqResComponentID); 

          targetReqResObj.connection = 'closed';
          store.default.dispatch(actions.reqResUpdate(targetReqResObj));

          this.state.abortController.abort();
          this.setState({
            abortController : new AbortController(),
          })
        }
      }


    render(props) {
      let text = 'OPEN CONNECTION';
      if (this.props.connectionStatus === 'open') { text = 'CLOSE CONNECTION'}

      return (
        <button id={this.props.reqResState.content.id} onClick={
            (e) => {
              this.handleToggleClick(e, this.state.abortController)
            }
          }>
            {text}
          </button>
      );
    }
  }
  
export default ToggleBtn;
