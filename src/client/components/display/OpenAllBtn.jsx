import React, { Component } from 'react';
import ReqResCtrl from '../../controllers/connectionController';

const OpenAllBtn = () => {
  return (
    <button className={'btn'} type='button' onClick={ ReqResCtrl.openAllSelectedReqRes }>Open Selected</button>
  );
};

export default OpenAllBtn;