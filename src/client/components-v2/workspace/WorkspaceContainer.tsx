import React from "react";
import { useSelector } from 'react-redux';

// Local components
import CurrentWorskpaceDisplay from "./CurrentWorkspaceDisplay";
import CollectionTree from './CollectionTree';

// MUI components and SVG icons
import { Box, Button, Typography, SelectChangeEvent } from '@mui/material';
import { AddRounded } from '@mui/icons-material';

export default function WorkspaceContainer(props) {
  /**
   * TODO: change the workspace container to have adjustable width sizing via user dragging
   * TODO: reimplement the "Schedule" functionality somehow
   * TODO: refactor store to remove explicit any
   */

  // currentWorkspace is the current Workspace's UUID. It is only altered in WorkspaceSelect.tsx, which is rendered by CurrentWorskpaceDisplay.tsx
  const [currentWorkspaceId, setWorkspace] = React.useState('');

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  }

  // Grab all of the workspaces from the Redux store. Hopefully this is O(1)...
  const allWorkspaces = useSelector((store: any) => store.business.collections);

  // Based on the currentWorkspaceUUID, grab the appropriate workspace from the "workspaces" array.
  const currentWorkspace = allWorkspaces.find(workspace => {
    return workspace.id === currentWorkspaceId;
  })

  return (
    <Box sx={{ minWidth: '20%', align: 'center', p: 1.5 }}>
      <CurrentWorskpaceDisplay currentWorkspaceId={currentWorkspaceId} handleWorkspaceChange={handleWorkspaceChange}/>

      <Box sx={{ p: 1 }}>
        <Typography>Collections</Typography>
        {currentWorkspace !== undefined && <CollectionTree currentWorkspace={currentWorkspace}/>}
        <Button variant="text" sx={{ width: 1, maxHeight: '24px', minHeight: '24px' }}>
          <AddRounded fontSize="small"/>
        </Button>
      </Box>

    </Box>
  )
}