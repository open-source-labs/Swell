import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';
import * as store from '../../store';
import * as actions from '../../actions/actions';

class ToggleBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isToggled: true,
          prevContentBody: [],
        };
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }
    
      componentDidMount() {
        this.setState({
          abortController : new AbortController(),
        })
      }
    
      handleToggleClick(e, abortCtrl, props) {
          console.log(this.props.reqResState.content.id)
        /* On Click if Toggle isn't open yet, OPEN IT*/
        if (this.state.isToggled) {
          ReqResCtrl.toggleOpenEndPoint(e, abortCtrl);
        /* Else CLOSE IT */
        } else {
          const reqResComponentID = e.target.id;
          const gotState = store.default.getState();
          const reqResArr = gotState.business.reqResArray;
          const targetReqResObj = reqResArr.find(obj => obj.id == reqResComponentID); 
    
          targetReqResObj.connection = 'closed';
          this.state.abortController.abort();
          this.setState({
            abortController : new AbortController(),
          })
        }
    
        this.setState(prevState => ({
            isToggled: !prevState.isToggled
        }));
      }
    
      
    render(props) {
      return (
        <button id={this.props.reqResState.content.id} onClick={
            (e) => { 
              this.handleToggleClick(e, this.state.abortController)
            }
          }>
            {this.state.isToggled ? 'OPEN CONNECTION' : 'CLOSE CONNECTION'}
          </button>
      );
    }
  }
  
export default ToggleBtn; 