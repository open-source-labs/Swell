import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/connectionController';

const CloseAllBtn = () => (
  <button className="btn" type="button" onClick={ReqResCtrl.closeAllReqRes}>
      Close Selected
  </button>
);

export default CloseAllBtn;
