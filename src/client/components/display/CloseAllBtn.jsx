import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

const CloseAllBtn = () => {
  return (
    <button type='button' onClick={ ReqResCtrl.closeAllReqRes }>Close All</button>
  );
};

export default CloseAllBtn;