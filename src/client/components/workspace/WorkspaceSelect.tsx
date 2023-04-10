import React from 'react';
import { Collection, ReqRes, WorkspaceContainerProps } from '../../../types';

import { useSelector, useDispatch } from 'react-redux';

import { reqResReplaced } from '../../toolkit-refactor/reqRes/reqResSlice';

import {
  Box,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { RootState } from '../../toolkit-refactor/store';

export default function WorkspaceSelect({
  currentWorkspaceId,
  setWorkspace,
}: WorkspaceContainerProps) {
  const dispatch = useDispatch();

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  };

  const updateReqRes = (reqResArray: ReqRes[]) => {
    dispatch(reqResReplaced(reqResArray));
  };

  const workspaces: Collection[] = useSelector(
    (store: RootState) => store.collections
  );

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
