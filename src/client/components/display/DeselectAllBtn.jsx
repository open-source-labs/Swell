import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';

const DeselectAllBtn = props => {
  return (<button className={'btn'} type='button' onClick={
    (e) => {
      ReqResCtrl.deselectAllResReq(e)
    }
  }>Deselect All</button>
  );
};

export default DeselectAllBtn;