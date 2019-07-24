import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/reqResController.js';

const DeselectAllBtn = props => (
  <button
    className="btn"
    type="button"
    onClick={(e) => {
      ReqResCtrl.deselectAllReqRes(e);
    }}
  >
      Deselect All
  </button>
);

export default DeselectAllBtn;
