import React from "react";

// Local components
import CurrentWorskpaceDisplay from "./CurrentWorkspaceDisplay";
import CollectionTree from './CollectionTree';
import SaveWorkspaceButton from "../buttons/SaveWorkspaceButton";

// MUI components and SVG icons
import { Box, Button, Typography, SelectChangeEvent } from '@mui/material';
import { AddRounded } from '@mui/icons-material';

// const saveCollection = (inputName) => {
//   const clonedArray = JSON.parse(JSON.stringify(reqResArray));
//   clonedArray.forEach((reqRes) => {
//     //reinitialize and minimize all things
//     reqRes.checked = false;
//     reqRes.minimized = true;
//     reqRes.timeSent = null;
//     reqRes.timeReceived = null;
//     reqRes.connection = 'uninitialized';
//     if (reqRes.response.hasOwnProperty('headers'))
//       reqRes.response = { headers: null, events: null };
//     else reqRes.response = { messages: [] };
//   });
//   const collectionObj = {
//     name: inputName,
//     id: uuid(),
//     createdAt: new Date(),
//     reqResArray: clonedArray,
//   };
//   collectionsController.addCollectionToIndexedDb([collectionObj]); //add to IndexedDB
//   dispatch(actions.collectionAdd(collectionObj));
//   setShowModal(false);
//   setCollectionNameErrorStyles(false);
// };

export default function WorkspaceContainer(props) {
  // TODO: change the workspace container to have adjustable width sizing via user dragging
  // TODO: reimplement the "Schedule" functionality somehow
  const [workspace, setWorkspace] = React.useState('home-workspace');

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  }

  return (
    <Box sx={{ minWidth: '20%', align: 'center', p: 1.5 }}>

      <CurrentWorskpaceDisplay workspace={workspace} handleWorkspaceChange={handleWorkspaceChange}/>

      <Box sx={{ p: 1 }}>
        <Typography>Collections</Typography>
        <CollectionTree workspace={workspace}/>
        <Button variant="text" sx={{ width: 1, maxHeight: '24px', minHeight: '24px' }}>
          <AddRounded fontSize="small"/>
        </Button>
      </Box>

    </Box>
  )
}