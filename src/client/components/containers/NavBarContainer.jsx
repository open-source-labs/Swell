import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/reqResController.js';
import ReactModal from 'react-modal';
import collectionsController from '../../controllers/collectionsController.js'
import uuid from 'uuid/v4';
import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
  reqResArray: store.business.reqResArray,
});
const mapDispatchToProps = dispatch => ({
  collectionAdd: (collection) => { dispatch(actions.collectionAdd(collection)) },
});

class NavBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.saveCollection = this.saveCollection.bind(this);
    this.saveName = this.saveName.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleOpenModal() {
    this.setState({ ...this.state, showModal: true });
  }
  handleCloseModal() {
    this.setState({ ...this.state, showModal: false });
  }

  saveName() {
    const inputName = document.querySelector('#collectionNameInput').value;
    if (!!inputName.trim()) {
      collectionsController.collectionNameExists({ name: inputName })
      .catch((err) => console.log("error in checking collection name: ", err))
      .then((found) => {
        if (found) { //if the name already exists
          document.querySelector('#collectionNameInput').setAttribute("style", "border-color: red;");
          document.querySelector('#collectionNameError').setAttribute("style", "display: block");
        }
        else this.saveCollection(inputName)
      })
    }
  }
  saveCollection(inputName) {
    const clonedArray = (this.props.reqResArray).slice()
    clonedArray.forEach((reqRes) => { //reinitialize and minimize all things
      reqRes.checked = false;
      reqRes.minimized = true;
      reqRes.timeSent = null;
      reqRes.timeReceived = null;
      reqRes.connection = 'uninitialized';
      if (reqRes.response.hasOwnProperty('headers')) reqRes.response = { headers: null, events: null }
      else reqRes.response = {messages: []}
    });
    const collectionObj = {
      name: inputName,
      id: uuid(),
      created_at: new Date(), 
      reqResArray: clonedArray
    }
    collectionsController.addCollectionToIndexedDb(collectionObj); //add to IndexedDB
    this.props.collectionAdd(collectionObj)
    this.setState({ showModal: false });
  }

  handleKeyPress(event) {
    const warning = document.querySelector('#collectionNameError');
    if (event.key === 'Enter') this.saveName();
    else if (warning.style.display === 'block') {
      warning.setAttribute("style", "display: none !important");
      document.querySelector('#collectionNameInput').setAttribute("style", "border: 2px solid $yellowgrey !important;");
    }
  }

  render(props) {
    ReactModal.setAppElement('#root');
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

          <ReactModal
            isOpen={this.state.showModal}
            className="collectionModal"
            overlayClassName="collectionModalOverlay"
            contentLabel="Enter a Collection Name"
            onRequestClose={this.handleCloseModal}
            shouldCloseOnOverlayClick={true}
            aria={{
              labelledby: "heading"
            }}
          >
            <h1 id="heading">What would you like to name your collection?</h1>
            <input type={'text'} id="collectionNameInput" onKeyDown={(e) => this.handleKeyPress(e)} autoFocus/>
            <p id="collectionNameError" style={{display:'none'}}>Collection name already exists!</p>
            <div>
              <button onClick={this.saveName}>Save</button>
              <button onClick={this.handleCloseModal}>Cancel</button>
            </div>
          </ReactModal>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);