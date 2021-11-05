/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'uuid/v4';
import collectionsController from '../../controllers/collectionsController';
import SaveModalSavedWorkspaces from '../display/SaveModalSavedWorkspaces';
import * as actions from '../../actions/actions';

function SaveWorkspaceModal({ showModal, setShowModal, match }) {
  const dispatch = useDispatch();
  // LOCAL STATE HOOKS
  const [input, setInput] = useState('');
  const [collectionNameErrorStyles, setCollectionNameErrorStyles] =
    useState(false);
  // PULL elements FROM store
  const reqResArray = useSelector((store) => store.business.reqResArray);
  const collections = useSelector((store) => store.business.collections);

  const saveCollection = (inputName) => {
    const clonedArray = JSON.parse(JSON.stringify(reqResArray));
    clonedArray.forEach((reqRes) => {
      //reinitialize and minimize all things
      reqRes.checked = false;
      reqRes.minimized = true;
      reqRes.timeSent = null;
      reqRes.timeReceived = null;
      reqRes.connection = 'uninitialized';
      if (reqRes.response.hasOwnProperty('headers'))
        reqRes.response = { headers: null, events: null };
      else reqRes.response = { messages: [] };
    });
    const collectionObj = {
      name: inputName,
      id: uuid(),
      createdAt: new Date(),
      reqResArray: clonedArray,
    };
    collectionsController.addCollectionToIndexedDb(collectionObj); //add to IndexedDB
    dispatch(actions.collectionAdd(collectionObj));
    setShowModal(false);
    setCollectionNameErrorStyles(false);
  };

  const updateCollection = (inputName, inputID) => {
    const clonedArray = reqResArray.slice();
    clonedArray.forEach((reqRes) => {
      //reinitialize and minimize all things
      reqRes.checked = false;
      reqRes.minimized = true;
      reqRes.timeSent = null;
      reqRes.timeReceived = null;
      reqRes.connection = 'uninitialized';
      if (reqRes.response.hasOwnProperty('headers'))
        reqRes.response = { headers: null, events: null };
      else reqRes.response = { messages: [] };
    });
    const collectionObj = {
      name: inputName,
      id: inputID,
      createdAt: new Date(),
      reqResArray: clonedArray,
    };
    collectionsController.updateCollectionInIndexedDb(collectionObj); //add to IndexedDB
    dispatch(actions.collectionUpdate(collectionObj));
    setShowModal(false);
    setCollectionNameErrorStyles(false);
  };

  const saveName = () => {
    if (input.trim()) {
      collectionsController
        .collectionNameExists({ name: input })
        .catch((err) =>
          console.error('error in checking collection name: ', err)
        )
        .then((found) => {
          if (found) {
            //if the name already exists, change style state
            setCollectionNameErrorStyles(true);
          } else saveCollection(input);
        });
    }
  };

  const workspaceComponents = collections.map((workspace, idx) => {
    return (
      <SaveModalSavedWorkspaces
        name={workspace.name}
        inputID={workspace.id}
        updateCollection={updateCollection}
        key={idx}
      />
    );
  });

  return (
    <div>
      {showModal && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => {
              setShowModal(false);
            }}
          />
          <div
            className="modal-content is-border-neutral-300
              is-modal-workspaces"
          >
            <div className="is-flex is-flex-direction-column m-3">
              {/* CUSTOM MODAL */}
              {/* SELECT EXISTING SAVED WORKSPACE TO WRITE OVER */}
              <h1 className="m-3">Select saved workspace to write over</h1>
              {workspaceComponents}
              <hr />
              {/* INPUT YOUR OWN NAME */}
              <h1 className="m-3">Name your saved workspace</h1>
              <div className="is-flex m-3">
                <input
                  input={input}
                  type="text"
                  onChange={(e) => setInput(e.target.value)}
                  className="input"
                />
              </div>
              {collectionNameErrorStyles && (
                <p id="collectionNameError" className="m-3">
                  Collection name already exists!
                </p>
              )}
              <div className="is-flex is-align-items-center is-justify-content-space-around">
                <button
                  className="button is-small is-fullwidth m-3 "
                  onClick={() => {
                    setShowModal(false);
                    setCollectionNameErrorStyles(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="button is-small is-fullwidth m-3 "
                  onClick={saveName}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaveWorkspaceModal;
