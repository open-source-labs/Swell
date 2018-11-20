import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

const CloseAllBtn = () => {
  return (
    <button className={'btn'} type='button' onClick={ ReqResCtrl.closeAllReqRes }>Close Selected</button>
  );
};

export default CloseAllBtn;