import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReactModal from "react-modal";
import uuid from "uuid/v4";
import ReqResCtrl from "../../controllers/reqResController.js";
import collectionsController from "../../controllers/collectionsController.js";
import * as actions from "../../actions/actions";

export default function SaveWorkspaceModal({ showModal, setShowModal }) {
  
  const dispatch = useDispatch();
  // LOCAL STATE HOOKS
  const [input, setInput] = useState('');
  const [collectionNameInputStyles, setCollectionNameInputStyles] = useState({});
  const [collectionNameErrorStyles, setCollectionNameErrorStyles] = useState({ display: "none" });
  // PULL elements FROM store
  const reqResArray = useSelector(store => store.business.reqResArray);
  
  const saveCollection = (inputName) => {
    const clonedArray = reqResArray.slice();
    clonedArray.forEach((reqRes) => {
      //reinitialize and minimize all things
      reqRes.checked = false;
      reqRes.minimized = true;
      reqRes.timeSent = null;
      reqRes.timeReceived = null;
      reqRes.connection = "uninitialized";
      if (reqRes.response.hasOwnProperty("headers"))
        reqRes.response = { headers: null, events: null };
      else reqRes.response = { messages: [] };
    });
    const collectionObj = {
      name: inputName,
      id: uuid(),
      created_at: new Date(),
      reqResArray: clonedArray,
    };
    collectionsController.addCollectionToIndexedDb(collectionObj); //add to IndexedDB
    setShowModal(false);
  }

  const saveName = () => {
    if (input.trim()) {
      collectionsController
        .collectionNameExists({ name: input })
        .catch((err) =>
          console.error("error in checking collection name: ", err)
        )
        .then((found) => {
          if (found) {
            //if the name already exists, change style state
            setCollectionNameInputStyles({ borderColor: "red" });
            setCollectionNameErrorStyles({ display: "block" });
          } else saveCollection(input);
        });
    }
  }
  return (
    <ReactModal
      isOpen={showModal}
      className="collectionModal"
      overlayClassName="collectionModalOverlay"
      contentLabel="Enter a Collection Name"
      onRequestClose={() => { setShowModal(false) } }
      shouldCloseOnOverlayClick
      aria={{
        labelledby: "heading",
      }}
    >
      <h1 id="heading">Name your collection</h1>
      <input
        style={collectionNameInputStyles}
        input={input}
        type="text"
        id="collectionNameInput"
        onChange={ e => setInput(e.target.value) }
        autoFocus
      />
      <p
        id="collectionNameError"
        style={collectionNameErrorStyles}
      >
        Collection name already exists!
      </p>
      <div>
        <button onClick={saveName}>Save</button>
        <button onClick={() => { setShowModal(false) } }>Cancel</button>
      </div>
    </ReactModal>
  )
}
