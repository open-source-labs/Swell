import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

const CloseAllBtn = props => {
  return (<button className={'btn'} type='button' onClick={
    (e) => ReqResCtrl.closeAllEndpoints(e)
  }>Close All</button>
  );
};

export default CloseAllBtn;