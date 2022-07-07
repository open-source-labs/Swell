/**
 * @todo Change the workspace container to have adjustable width sizing via
 * user dragging
 *
 * @todo Reimplement the "Schedule" functionality somehow
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// Local components
import CurrentWorskpaceDisplay from './CurrentWorkspaceDisplay';
import LegacyWorkspaceContainer from './LegacyWorkspaceContainer';
import BarGraph from '../legacy-components/BarGraph';
// import CollectionsContainer from "../../components/containers/CollectionsContainer";
import CollectionTree from './CollectionTree';

// MUI components and SVG icons
import {
  Box,
  Button,
  Typography,
  SelectChangeEvent,
  Divider,
} from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { RootState, useAppDispatch } from '../../toolkit-refactor/store';

export default function WorkspaceContainer({
  currentWorkspaceId,
  setWorkspace,
}) {
  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  };

  // Grab all of the workspaces from the Redux store. Hopefully this is O(1)...
  const allWorkspaces = useSelector((store: RootState) => store.collections);

  // Based on the currentWorkspaceUUID, grab the appropriate workspace from the "workspaces" array and pass it into the CollectionTree component.
  const currentWorkspace = allWorkspaces.find((workspace) => {
    return workspace.id === currentWorkspaceId;
  });

  return (
    <Box
      className="workspace-container"
      sx={{ minWidth: '20%', align: 'center' }}
    >
      {/* The display for your current workspace. Contains functionality for saving, importing, exporting, and adding other GitHub users to your workspace. */}
      <CurrentWorskpaceDisplay
        currentWorkspaceId={currentWorkspaceId}
        currentWorkspace={currentWorkspace}
        handleWorkspaceChange={handleWorkspaceChange}
      />
      <Box className="collections-container">
        <Typography>Requests</Typography>
        <Divider orientation="horizontal" />
        <LegacyWorkspaceContainer />
      </Box>

      {/* Conditionally render either a message or collection tree depending on if a workspace is selected */}
      {
        // currentWorkspace === undefined
        // ? <Typography variant="caption">Get started by selecting, importing, or creating a new workspace.</Typography>
        // : <Box className="collections-container">
        //     <Typography>Requests</Typography>
        //     <Divider orientation="horizontal" />
        //     <LegacyWorkspace />
        //     {/* <CollectionTree currentWorkspace={currentWorkspace}/> */}
        //   </Box>
      }

      {/**
       * @todo Below button is not ready to be added. Would eventually be used
       * to add another collection to a workspace. However, workspaces are
       * currently only built to handle 1 collection max. Need to refactor Redux
       * store to get this button to work.
       */}

      {/* <Button variant="text" sx={{ width: 1, maxHeight: '24px', minHeight: '24px' }}>
        <AddRounded fontSize="small"/>
      </Button> */}
    </Box>
  );
}
