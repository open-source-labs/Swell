import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';
import * as store from '../../store';
import * as actions from '../../actions/actions';

class CloseBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  handleCloseClick(e, abortCtrl) {
    ReqResCtrl.closeEndPoint(e); 
  }


  render(props) {
    return (<button type='button' id={this.props.reqResState.content.id}  onClick={
      (e) => this.handleCloseClick(e)
    }>Close</button>
    );
  }
};

export default CloseBtn;