import React, { Component } from 'react';
import ReqResCtrl from '../../controllers/reqResController.js';
const { ipcRenderer } = require("electron");
import ReactModal from 'react-modal';
import Prompt from '../../../prompts/Prompt.jsx'

class NavBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    console.log("here")
    this.setState({ showModal: false });
  }

  render(props) {
    return (
      <div className="navbar-console">
        <div className="navbar-console_inner">
          <button className="btn" type="button" onClick={ReqResCtrl.selectAllReqRes}>
            Select All
          </button>

          <button className="btn" type="button" onClick={(e) => { ReqResCtrl.deselectAllReqRes(e) }}>
            Deselect All
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.openAllSelectedReqRes}>
            Open Selected
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.closeAllReqRes}>
            Close Selected
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.minimizeAllReqRes}>
            Minimize All
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.expandAllReqRes}>
            Expand All
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.clearAllReqRes}>
            Clear All
          </button>

          <button className="btn" type="button" onClick={this.handleOpenModal}>
            Save Collection
          </button>

          {/* <ReactModal
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
            shouldCloseOnOverlayClick={true}
            style={{
              overlay: {
                backgroundColor: 'lightsteelblue'
              },
              content: {
                color: 'lightsteelblue'
              }
            }}
          >

            <button onClick={this.handleCloseModal}>Close Modal</button>
          </ReactModal> */}
          <Prompt isOpen={this.state.showModal} handleCloseModal={this.props.handleCloseModal}/>

        </div>
      </div>
    );
  }
}

export default NavBarContainer;
