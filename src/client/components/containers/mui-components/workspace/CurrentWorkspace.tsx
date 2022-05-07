import React from "react";
import { Box } from '@mui/material';
import WorkspaceSelect from './WorkspaceSelect';

const CurrentWorkspace = (props) => {
  return (
    <Box sx={{ mr: 1, flexGrow: 1, alignItems: 'center' }}>
      {/* The below select menu should contain all saved workspaces in the Swell app. */}
      <WorkspaceSelect />
    </Box>
  )
}

export default CurrentWorkspace;