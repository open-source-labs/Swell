/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/toolkit/store';
import {
  collectionUpdated,
  collectionAdded,
} from '~/toolkit/slices/collectionsSlice';

import { v4 as uuid } from 'uuid';
import collectionsController from '../../../controllers/collectionsController';
import SaveModalSavedWorkspaces from './SaveModalSavedWorkspaces';
import { ReqRes } from '../../../../../src/types';

interface modalSwitch {
  showModal: boolean;
  setShowModal: (showSwitch: boolean) => void;
}

export default function SaveWorkspaceModal({
  showModal,
  setShowModal,
}: modalSwitch): JSX.Element {
  const dispatch = useAppDispatch();
  // LOCAL STATE HOOKS
  const [input, setInput] = useState('');
  const [collectionNameErrorStyles, setCollectionNameErrorStyles] =
    useState(false);

  const reqResArray = useAppSelector((store) => store.reqRes.reqResArray);
  const collections = useAppSelector((store) => store.collections);

  const saveCollection = (inputName: string): void => {
    const clonedArray = JSON.parse(JSON.stringify(reqResArray));
    clonedArray.forEach((reqRes: ReqRes) => {
      //reinitialize and minimize all things
      reqRes.checked = false;
      reqRes.minimized = true;
      reqRes.timeSent = null;
      reqRes.timeReceived = null;
      reqRes.connection = 'uninitialized';
      if (reqRes.response.hasOwnProperty('headers'))
        reqRes.response = { headers: undefined, events: undefined };
      else reqRes.response = { messages: [] };
    });
    const collection = {
      name: inputName,
      id: uuid(),
      createdAt: new Date(),
      reqResArray: clonedArray,
    };
    collectionsController.addCollectionToIndexedDb([collection]); //add to IndexedDB
    dispatch(collectionAdded(collection));
    setShowModal(false);
    setCollectionNameErrorStyles(false);
  };

  const updateCollection = (inputName: string, inputID: string): void => {
    const clonedArray = JSON.parse(JSON.stringify(reqResArray));
    clonedArray.forEach((reqRes: ReqRes) => {
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
    dispatch(collectionUpdated(collectionObj));
    setShowModal(false);
    setCollectionNameErrorStyles(false);
  };

  const saveName = (): void => {
    if (input.trim()) {
      collectionsController
        .collectionNameExists(input)
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

  const workspaceComponents = collections.map((workspace, idx): JSX.Element => {
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
                  value={input}
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
