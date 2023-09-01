import React from 'react';
import { useAppSelector, useAppDispatch } from '~/toolkit/store';
import { reqResReplaced } from '~/toolkit/slices/reqResSlice';

import { type ReqRes, type WorkspaceContainerProps } from '~/types';

import {
  Box,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';

export default function WorkspaceSelect({
  currentWorkspaceId,
  setWorkspace,
}: WorkspaceContainerProps) {
  const dispatch = useAppDispatch();

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  };

  const updateReqRes = (reqResArray: ReqRes[]) => {
    dispatch(reqResReplaced(reqResArray));
  };

  const workspaces = useAppSelector((store) => store.collections);

  const menuItems =
    workspaces.length > 0
      ? workspaces.map((workspace) => (
          <MenuItem
            key={workspace.id}
            value={workspace.id}
            onClick={() => updateReqRes(workspace.reqResArray)}
          >
            {workspace.name}
          </MenuItem>
        ))
      : [];

  return (
    <Box sx={{ mr: 1, flexGrow: 1 }}>
      <FormControl fullWidth variant="standard">
        <Select
          id="workspace-select"
          label="workspace"
          value={currentWorkspaceId || ''}
          onChange={handleWorkspaceChange}
        >
          {menuItems}
        </Select>
        <FormHelperText>Current Workspace</FormHelperText>
      </FormControl>
    </Box>
  );
}
