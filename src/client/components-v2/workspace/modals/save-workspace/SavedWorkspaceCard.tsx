import React from 'react';

// Import MUI components
import { Box, Button } from '@mui/material';

export default function SavedWorkspaceCard({ workspace, updateCollection }) {
  console.log(workspace)
  return(
    <Button
      onClick={() => {
        updateCollection(workspace.name, workspace.id);
      }}
    >
      <Box>
        {workspace.name}
      </Box>
    </Button>
  )
}
