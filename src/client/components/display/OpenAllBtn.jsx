import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

class OpenAllBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleOpenAllClick = this.handleOpenAllClick.bind(this);
  }

  handleOpenAllClick(e) {
    ReqResCtrl.openAllEndpoints(e);
  }
  
  render(props) {
    return (<button type='button' onClick={
      (e) => {
        ReqResCtrl.openAllEndPoints(e)
      }
    }>Force Open All</button>
    );
  }
};

export default OpenAllBtn;