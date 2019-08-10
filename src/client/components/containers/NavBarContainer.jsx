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
      newName: ""
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.saveCollection = this.saveCollection.bind(this);
    this.saveName = this.saveName.bind(this);
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
      this.setState({ ...this.state, newName: inputName });
    }
    collectionsController.collectionNameExists({ name: inputName })
  }
  saveCollection() {
    this.setState({ showModal: false });
    // const clonedArray = (this.props.reqResArray).slice()
    // clonedArray.forEach((reqRes) => {
    //   if (!reqRes.minimized && reqRes.tab === currentTab) {
    //     reqRes.minimized = true;
    //   }
    // });
    // console.log({ clonedArray })
    // const collectionObj = {
    //   name: this.state.newName,
    //   id: uuid(),
    //   reqResArray: clonedArray
    // }
    // collectionsController.addCollectionToIndexedDb(collectionObj); //add to IndexedDB
    // this.props.collectionAdd(collectionObj)
    this.props.collectionAdd({
      id: uuid(),
      created_at: new Date(),
      name: "meep",
      reqResArray: [{
        "id": "e21f69905-08b6-4058-ba2e-3fe492bc7e99",
        "created_at": "Sat Jul 20 2019 16: 11: 42 GMT - 0400(EDT)",
        "protocol": "http://",
        "host": "http://pokeapi.co",
        "path": "/api/v2/pokemon/squirtle",
        "checkSelected": false,
        "checked": false,
        "connection": "uninitialized",
        "connectionType": null,
        "created_at": "Sat Jul 20 2019 16: 11: 42 GMT - 0400(EDT)",
        "request": { method: "GET", headers: [], body: "", cookies: [], bodyType: "none" },
        "response": { headers: null, events: null },
        "tab": "First Tab",
        "timeReceived": null,
        "timeSent": null,
        "url": "http://pokeapi.co/api/v2/pokemon/squirtle"
      }]
    })
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
            contentLabel="Minimal Modal Example"
            shouldCloseOnOverlayClick={true}
          >
            <h1>What would you like to name your collection?</h1>
            <input type={'text'} id="collectionNameInput" />
            <div>
              <button onClick={() => { this.saveName(); this.saveCollection() }}>Save</button>
              <button onClick={this.handleCloseModal}>Cancel</button>
            </div>
          </ReactModal>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);