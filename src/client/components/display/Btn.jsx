import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';
import * as store from '../../store';
import * as actions from '../../actions/actions';

class Btn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(props) {
    return <button type="button" />;
  }
}

export default Btn;
