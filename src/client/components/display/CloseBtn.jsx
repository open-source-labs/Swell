import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

const CloseBtn = props => {
    return (
    <button type='button' id={props.reqResState.content.id}  onClick={
      (e) => ReqResCtrl.closeEndPoint(e)
    }>Close</button>
    );
};

export default CloseBtn;