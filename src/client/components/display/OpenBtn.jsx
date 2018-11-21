import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/connectionController';

class OpenBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button className={'btn'} style={this.props.stylesObj} type='button' onClick={ () => ReqResCtrl.openReqRes(this.props.content.id)}>Open</button>
    );
  }
};

export default OpenBtn;