import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

class OpenBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleOpenClick = this.handleOpenClick.bind(this);
  }

  handleOpenClick(e) {
    ReqResCtrl.setAbortCtrl(e.target.id);
  }
  
  render() {
    return (<button id={this.props.reqResState.content.id}  type='button' onClick={
        (e) => this.handleOpenClick(e)
      }>Open</button>
    );
  }
};

export default OpenBtn;