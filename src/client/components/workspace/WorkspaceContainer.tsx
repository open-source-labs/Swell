/**
 * @todo Change the workspace container to have adjustable width sizing via
 * user dragging
 */
import React from 'react';

// Local components
import WorkspaceContainerButtons from './buttons/WorkspaceContainerButtons';
import WorkspaceSelect from './WorkspaceSelect';
import DeleteWorkspaceButton from './buttons/DeleteWorkspaceButton';
import ImportExportWorkspaceButton from './buttons/ImportExportWorkspaceButton';

// MUI components and SVG icons
import { Box, Typography, Divider } from '@mui/material';
import { WorkspaceContainerProps } from '../../../types';

export default function WorkspaceContainer(props: WorkspaceContainerProps) {
  return (
    <Box
      className="workspace-container"
      sx={{ minWidth: '20%', align: 'center' }}
    >
      {/* 
      The display for your current workspace. Contains functionality for 
      saving, importing, exporting  workspace to your local machine. */}
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', pb: 1 }}>
        {/* The below select menu should contain all saved workspaces in the Swell app. */}
        <WorkspaceSelect {...props} />
        <DeleteWorkspaceButton {...props} />
        <ImportExportWorkspaceButton />
      </Box>
      <Box className="collections-container">
        <Typography>Requests</Typography>
        <Divider orientation="horizontal" />
        <WorkspaceContainerButtons />
      </Box>
    </Box>
  );
}
