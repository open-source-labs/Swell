import React, { FC } from 'react';
import { ReqRes } from '../../../types';

import { useSelector, useDispatch, connect } from 'react-redux';

import { reqResReplaced } from '../../toolkit-refactor/reqRes/reqResSlice';

// Import local components
import DeleteWorkspaceButton from './buttons/DeleteWorkspaceButton';
// Import MUI components
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ImportWorkspaceModal from './modals/import-workspace/ImportWorkspaceModal';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
} from '@mui/material';

export default function WorkspaceSelect({
  currentWorkspaceId,
  handleWorkspaceChange,
  workspaces,
}) {
  // This state is used in the commented-out modal component
  const setIsOpen = React.useState(false)[1];
  const dispatch = useDispatch();

  const updateReqRes = (reqResArray: ReqRes[]) => {
    dispatch(reqResReplaced(reqResArray));
  };

  const menuItems = workspaces.map((workspace) => (
    <MenuItem
      key={workspace.id}
      value={workspace.id}
      onClick={() => updateReqRes(workspace.reqResArray)}
    >
      {workspace.name}
    </MenuItem>
  ));

  return (
    <Box sx={{ mr: 1, flexGrow: 1 }}>
      <FormControl fullWidth variant="standard">
        <Select
          id="workspace-select"
          label="workspace"
          value={currentWorkspaceId}
          onChange={handleWorkspaceChange}
        >
          {menuItems}
          {/* Import Workspace button */}
          {/* <MenuItem value="" onClick={handleOpen}><FileDownloadRoundedIcon /></MenuItem> */}
          {/* <WorkspaceContextMenu /> */}
        </Select>
        <FormHelperText>Current Workspace</FormHelperText>
      </FormControl>

      {/**
       * @todo This modal seems close to done, but there's no way to turn it
       * off. It just hijacks your ability to use the app. Uncomment this
       * component to see for yourself.
       */}
      {/* <ImportWorkspaceModal
        open={() => setIsOpen(true)}
        handleClose={() => setIsOpen(false)}
      /> */}
    </Box>
  );
}
