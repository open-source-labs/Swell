import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

const CloseBtn = props => {
    return (
    <button className={'btn'}  type='button' onClick={
      () => ReqResCtrl.closeReqRes(props.content.id)
    }>Close</button>
    );
};

export default CloseBtn;