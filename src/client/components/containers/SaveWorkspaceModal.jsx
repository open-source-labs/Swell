import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import uuid from "uuid/v4";
import collectionsController from "../../controllers/collectionsController.js";
import * as actions from "../../../../src/client/actions/actions.js";

export default function SaveWorkspaceModal({ showModal, setShowModal, match }) {
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
    dispatch(actions.collectionAdd(collectionObj));
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
    <div>
      {showModal && 
        <div className="modal is-active">
          <div className="modal-background"
            onClick={() => { setShowModal(false) }}
            />
          <div 
            className="modal-content is-border-neutral-300
              is-modal-workspaces"
            >
            <div className="is-flex is-flex-direction-column m-3">
              {/* CUSTOM MODAL */}
              <h1 className="m-3">Name your saved workspace</h1>
              <div className="is-flex m-3">
                <input
                  input={input}
                  type="text"
                  onChange={ e => setInput(e.target.value) }
                  autoFocus
                  // style={collectionNameInputStyles}
                  className="input"
                  />
              </div>
              <p
                id="collectionNameError"
                style={collectionNameErrorStyles}
                className="m-3"
                >
                  Collection name already exists!
              </p>
              <div
                className="is-flex is-align-items-center is-justify-content-space-around"
                >
                <button className="button is-small is-fullwidth m-3 " onClick={() => { setShowModal(false) } }>Cancel</button>
                <button className="button is-small is-fullwidth m-3 " onClick={saveName}>Save</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
