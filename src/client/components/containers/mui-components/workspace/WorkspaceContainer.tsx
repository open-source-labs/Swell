import React from "react";

// Local components
import CurrentWorskpaceDisplay from "./CurrentWorkspaceDisplay";
import CollectionTree from './CollectionTree';

// MUI components and SVG icons
import { Box, Button, Typography, SelectChangeEvent } from '@mui/material';
import { SaveRounded, IosShareRounded, AddRounded } from '@mui/icons-material';


const WorkspaceContainer = (props) => {
  // TODO: change the workspace container to have adjustable width sizing via user dragging
  // TODO: reimplement the "Schedule" functionality somehow
  const [workspace, setWorkspace] = React.useState('home-workspace');

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  }

  return (
    <Box sx={{ minWidth: '20%', align: 'center', p: 1.5 }}>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CurrentWorskpaceDisplay workspace setWorkspace handleWorkspaceChange/>
        <Button variant="text" sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}>
          <SaveRounded fontSize="small"/>
        </Button>
        <Button variant="text" sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}>
          <IosShareRounded fontSize="small"/>
        </Button>
      </Box>

      <Box sx={{ p: 1 }}>
        <Typography>Collections</Typography>
        <CollectionTree />
        <Button variant="text" sx={{ width: 1, maxHeight: '24px', minHeight: '24px' }}>
          <AddRounded fontSize="small"/>
        </Button>
      </Box>

    </Box>
  )
}

export default WorkspaceContainer;