import React from 'react';

// Import MUI components
import { Box } from '@mui/material';

export default function SavedWorkspaceCard({ workspace }) {
  console.log(workspace)
  return(
    <Box>
      {workspace.name}
    </Box>
  )
}
