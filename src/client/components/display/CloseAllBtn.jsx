import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';
import * as store from '../../store';
import * as actions from '../../actions/actions';

class CloseAllBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleCloseAllClick = this.handleCloseAllClick.bind(this);
  }

  handleCloseAllClick(e) {
    ReqResCtrl.closeAllEndpoints(e);
  }

  render(props) {
    return (<button type='button' onClick={
      (e) => this.handleCloseAllClick(e)
    }>Close All</button>
    );
  }
};

export default CloseAllBtn;