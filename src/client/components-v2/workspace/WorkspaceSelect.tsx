import React from "react";
import { useSelector, useDispatch, connect } from 'react-redux';
import * as actions from '../../features/business/businessSlice';
// Import local components
import DeleteWorkspaceButton from './buttons/DeleteWorkspaceButton'
// Import MUI components
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ImportWorkspaceModal from "./modals/import-workspace/ImportWorkspaceModal"
import { Box, Select, MenuItem, FormControl, FormHelperText, Button } from '@mui/material';

export default function WorkspaceSelect({ currentWorkspaceId, handleWorkspaceChange, workspaces }) {
  const [open, setOpen] = React.useState(false);
  // TODO: change store explicit any to a more defined type
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  const collectionToReqRes = (reqResArray) => {
    dispatch(actions.collectionToReqRes(reqResArray));
  }

  // const localWorkspaces = useSelector((store: any) => store.business.collections);
  const menuItems = [];
  for (let workspace of workspaces) {
    menuItems.push(
      <MenuItem
        key={workspace.id}
        value={workspace.id}
        onClick={() => collectionToReqRes(workspace.reqResArray)}
      >
        {workspace.name}
      </MenuItem>
    )
  }

  return (
    <Box sx={{mr: 1, flexGrow: 1}}>
      <FormControl
        fullWidth
        variant="standard">
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
      <ImportWorkspaceModal open={open} handleClose={handleClose}/>
    </Box>
  )
}
