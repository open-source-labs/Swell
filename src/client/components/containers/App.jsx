import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../../assets/style/App.scss'
import * as actions from '../../actions/actions';
import NavContainer from './NavContainer.jsx';
import ContentsContainer from './ContentsContainer.jsx';
import ModalContainer from '../Modal/ModalContainer.jsx';
import { ipcRenderer } from 'electron';
import ReqResCtrl from '../../controllers/connectionController'

const mapStateToProps = store => ({
  store: store,
});

const mapDispatchToProps = dispatch => ({

});

class App extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.store);
  }

  componentDidMount() {
    // const wave = new Audio('../../../assets/audio/wavebig.mp3');
    // wave.play();
    ipcRenderer.on('openAllSelected', ReqResCtrl.openAllSelectedReqRes);
    ipcRenderer.on('closeAllSelected', ReqResCtrl.closeAllReqRes);
    ipcRenderer.on('clearAll', ReqResCtrl.clearAllReqRes);
  }

  render() {
    return(
      <div id='app'>
        {/* App */}
        <NavContainer/>
        <ContentsContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);