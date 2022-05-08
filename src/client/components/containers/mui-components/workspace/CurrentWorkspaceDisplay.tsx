import React from "react";
import { Box } from '@mui/material';
import WorkspaceSelect from './WorkspaceSelect';
import SaveWorkspaceButton from "../buttons/SaveWorkspaceButton";
import ExportWorkspaceButton from "../buttons/ExportWorkspaceButton";

export default function CurrentWorkspaceDisplay(props) {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
      {/* The below select menu should contain all saved workspaces in the Swell app. */}
      <WorkspaceSelect {...props} />
      <SaveWorkspaceButton />
      <ExportWorkspaceButton />
    </Box>
  )
}