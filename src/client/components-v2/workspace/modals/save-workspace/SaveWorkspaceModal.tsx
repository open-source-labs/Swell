import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
// Import actions.
import * as actions from '../../../../features/business/businessSlice'
// Import controllers.
import collectionsController from '../../../../controllers/collectionsController';
// Import local components.
import SavedWorkspaceCard from './SavedWorkspaceCard';
// Import MUI components.
import { Backdrop, Box, Modal, Fade, Typography } from '@mui/material';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1
};

export default function SaveWorkspaceModal({ open, handleClose }) {
  const dispatch = useDispatch();
  // Initialize state.
  const [input, setInput] = useState('');
  const [collectionNameErrorStyles, setCollectionNameErrorStyles] = useState(false);
  // Pull elements from store.
  // TODO: remove explicit any. May require refactoring the store.
  const reqResArray = useSelector((store: any) => store.business.reqResArray);
  const collections = useSelector((store: any) => store.business.collections);

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
    const collection = {
      name: inputName,
      id: uuid(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      reqResArray: clonedArray,
    };
    collectionsController.addCollectionToIndexedDb([collection]); //add to IndexedDB
    dispatch(actions.collectionAdd(collection));
    // setShowModal(false);
    setCollectionNameErrorStyles(false);
    handleClose();
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
    // TODO: only adjust modifiedAt property
    const collectionObj = {
      name: inputName,
      id: inputID,
      createdAt: new Date(),
      modifiedAt: new Date(),
      reqResArray: clonedArray,
    };
    collectionsController.updateCollectionInIndexedDb(collectionObj); //add to IndexedDB
    dispatch(actions.collectionUpdate(collectionObj));
    setCollectionNameErrorStyles(false);
    handleClose();
  };

  const saveName = () => {
    if (input.trim()) {
      collectionsController
        .collectionNameExists(input)
        .catch((err) =>
          console.error('error in checking collection name: ', err)
        )
        .then((found) => {
          if (found) {
            // if the name already exists, change style state
            setCollectionNameErrorStyles(true);
          } else saveCollection(input);
        });
    }
  };

  const savedWorkspaceCards = [];
  for(let savedWorkspace of collections) {
    savedWorkspaceCards.push(<SavedWorkspaceCard key={savedWorkspace.id} workspace={savedWorkspace} updateCollection={updateCollection}/>)
  }

  return (
    <Modal
      aria-labelledby="save-workspace-modal"
      aria-describedby="save-current-workspace"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>

        <Box sx={style}>
          <Typography id="save-workspace-modal-title" variant="h6" component="h2">
            Save As
          </Typography>
          <Typography id="save-workspace-modal-description" sx={{ mt: 1 }}>
            Put the original app's save workspace functionality here. Maybe there can be two options: save, and save+commit.
          </Typography>
          {savedWorkspaceCards}
        </Box>

      </Fade>
    </Modal>
  );
}
