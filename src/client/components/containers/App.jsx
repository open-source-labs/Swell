import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../../assets/style/App.scss';
import { ipcRenderer } from 'electron';
import * as actions from '../../actions/actions';
import ContentsContainer from './ContentsContainer.jsx';
import ReqResCtrl from '../../controllers/connectionController';
import SidebarContainer from './SidebarContainer.jsx';
import UpdatePopUpContainer from './UpdatePopUpContainer.jsx';
import dbController from '../../controllers/dbController'
import db from '../../db';

const mapStateToProps = store => ({
  store,
});

const mapDispatchToProps = dispatch => ({});

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ipcRenderer.on('selectAll', ReqResCtrl.selectAllResReq);
    ipcRenderer.on('deselectAll', ReqResCtrl.deselectAllResReq);
    ipcRenderer.on('openAllSelected', ReqResCtrl.openAllSelectedReqRes);
    ipcRenderer.on('closeAllSelected', ReqResCtrl.closeAllReqRes);
    ipcRenderer.on('clearAll', ReqResCtrl.clearAllReqRes);
    ipcRenderer.on('message', (e, text) => {
      // console.log('Message from updater: ', text)
    });
    dbController.getHistory();
  }

  render() {
    return (
      <div id="app">
        {/* <UpdatePopUpContainer/> */}
        <SidebarContainer />
        <ContentsContainer />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
