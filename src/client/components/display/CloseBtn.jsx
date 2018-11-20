import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/connectionController';

const CloseBtn = props => {
    return (
    <button className={'btn'} style={props.stylesObj} type='button' onClick={
      () => ReqResCtrl.closeReqRes(props.content.id)
    }>Close</button>
    );
};

export default CloseBtn;