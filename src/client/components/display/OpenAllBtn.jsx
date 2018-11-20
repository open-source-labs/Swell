import React, { Component } from 'react';
import ReqResCtrl from '../ReqResCtrl';

const OpenAllBtn = () => {
  return (
    <button type='button' onClick={ ReqResCtrl.openAllSelectedReqRes }>Open All</button>
  );
};

export default OpenAllBtn;