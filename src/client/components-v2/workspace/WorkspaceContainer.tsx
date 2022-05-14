import React from "react";
import { useSelector } from 'react-redux';

// Local components
import CurrentWorskpaceDisplay from "./CurrentWorkspaceDisplay";
import CollectionTree from './CollectionTree';

// MUI components and SVG icons
import { Box, Button, Typography, SelectChangeEvent, Divider } from '@mui/material';
import { AddRounded } from '@mui/icons-material';

export default function WorkspaceContainer({ currentWorkspaceId, setWorkspace }) {
  /**
   * TODO: change the workspace container to have adjustable width sizing via user dragging
   * TODO: reimplement the "Schedule" functionality somehow
   * TODO: refactor store to remove explicit any
   */

  // // currentWorkspace is the current Workspace's UUID. It is only altered in WorkspaceSelect.tsx, which is rendered by CurrentWorskpaceDisplay.tsx
  // const [currentWorkspaceId, setWorkspace] = React.useState('');

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  }

  // Grab all of the workspaces from the Redux store. Hopefully this is O(1)...
  const allWorkspaces = useSelector((store: any) => store.business.collections);

  // Based on the currentWorkspaceUUID, grab the appropriate workspace from the "workspaces" array and pass it into the CollectionTree component.
  const currentWorkspace = allWorkspaces.find(workspace => {
    return workspace.id === currentWorkspaceId;
  })

  return (
    <Box className="workspace-container" sx={{ minWidth: '20%', align: 'center', p: 1.5 }}>
      {/* The display for your current workspace. Contains functionality for saving, importing, exporting, and adding other GitHub users to your workspace. */}
      <CurrentWorskpaceDisplay currentWorkspaceId={currentWorkspaceId} handleWorkspaceChange={handleWorkspaceChange}/>
      {/* Conditionally render either a message or collection tree depending on if a workspace is selected */}
      {currentWorkspace === undefined
        ? <Typography variant="caption">Get started by selecting, importing, or creating a new workspace.</Typography>
        : <Box className="collections-container">
            <Typography>Collections</Typography>
            <Divider orientation="horizontal" />
            <CollectionTree currentWorkspace={currentWorkspace}/>
          </Box>
      }
      {/**
       * TODO:
       * Below button is not ready to be added. Would eventually be used to add another collection to a workspace.
       * However, workspaces are currently only built to handle 1 collection max.
       * Need to refactor Redux store to get this button to work.
       */}
      {/* <Button variant="text" sx={{ width: 1, maxHeight: '24px', minHeight: '24px' }}>
        <AddRounded fontSize="small"/>
      </Button> */}
    </Box>
  )
}
