/**
 * @todo Change the workspace container to have adjustable width sizing via
 * user dragging
 *
 * @todo Reimplement the "Schedule" functionality somehow
 */
import React from 'react';
import { useSelector } from 'react-redux';

// Local components
import CurrentWorkspaceDisplay from './CurrentWorkspaceDisplay';
import LegacyWorkspaceContainer from './LegacyWorkspaceContainer';

// MUI components and SVG icons
import { Box, Typography, SelectChangeEvent, Divider } from '@mui/material';
import { RootState } from '../../toolkit-refactor/store';
import { WorkspaceContainerProps } from '../../../types';

export default function WorkspaceContainer({
  currentWorkspaceId,
  setWorkspace,
}: WorkspaceContainerProps) {
  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  };

  // Grab all of the workspaces from the Redux store. Hopefully this is O(1)...
  const allWorkspaces = useSelector((store: RootState) => store.collections);

  const currentWorkspace = allWorkspaces.find((workspace) => {
    return workspace.id === currentWorkspaceId;
  });

  return (
    <Box
      className="workspace-container"
      sx={{ minWidth: '20%', align: 'center' }}
    >
      {/* 
      The display for your current workspace. Contains functionality for 
      saving, importing, exporting, and adding other GitHub users to your 
      workspace. */}
      <CurrentWorkspaceDisplay
        currentWorkspaceId={currentWorkspaceId}
        currentWorkspace={currentWorkspace}
        handleWorkspaceChange={handleWorkspaceChange}
      />
      <Box className="collections-container">
        <Typography>Requests</Typography>
        <Divider orientation="horizontal" />
        <LegacyWorkspaceContainer />
      </Box>
    </Box>
  );
}
