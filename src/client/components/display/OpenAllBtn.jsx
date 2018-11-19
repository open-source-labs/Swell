import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

const OpenAllBtn = props => {
  return (<button type='button' onClick={
    (e) => {
      ReqResCtrl.openAllEndPoints()
    }
  }>Open All</button>
  );
};

export default OpenAllBtn;