import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/connectionController.js';

const DeselectAllBtn = props => (
  <button
    className="btn"
    type="button"
    onClick={(e) => {
      ReqResCtrl.deselectAllResReq(e);
    }}
  >
      Deselect All
  </button>
);

export default DeselectAllBtn;
