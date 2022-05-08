import React from "react";
import { Box, Button } from '@mui/material';
import { IosShareRounded } from "@mui/icons-material";
import WorkspaceSelect from './WorkspaceSelect';
import SaveWorkspaceButton from "./SaveWorkspaceButton";

export default function CurrentWorkspaceDisplay(props) {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
      {/* The below select menu should contain all saved workspaces in the Swell app. */}
      <WorkspaceSelect {...props} />
      <SaveWorkspaceButton />
      <Button variant="text" sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}>
        <IosShareRounded fontSize="small"/>
      </Button>
    </Box>
  )
}