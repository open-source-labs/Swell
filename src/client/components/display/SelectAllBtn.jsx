import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/connectionController.js';

const SelectAllBtn = props => {
  return (<button className={'btn'} type='button' onClick={ ReqResCtrl.selectAllResReq }>Select All</button>
  );
};

export default SelectAllBtn;