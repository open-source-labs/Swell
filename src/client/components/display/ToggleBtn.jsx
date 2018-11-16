import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

class ToggleBtn extends Component {
    constructor(props) {
      super(props);
      this.state = {
          isToggled: true
        };
        this.handleClick = this.handleClick.bind(this);
    }
  
      handleClick(e, abortCtrl) {
        ReqResCtrl.toggleEndPoint(e, abortCtrl)
      	this.setState(prevState => ({
            isToggled: !prevState.isToggled
      	}));
      }
    render() {
      return (
        <button onClick={(e, abortControl) => this.handleClick(e, abortControl)}>
          {this.state.isToggled ? 'OPEN CONNECTION' : 'CLOSE CONNECTION'}
        </button>
      );
    }
  }
  
export default ToggleBtn;