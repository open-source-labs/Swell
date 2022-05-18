import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../features/business/businessSlice';
// Import local components
import WorkspaceContextMenu from "./WorkspaceContextMenu";
// Import MUI components
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ImportWorkspaceModal from "./modals/import-workspace/ImportWorkspaceModal"
import { Box, Select, MenuItem, FormControl, FormHelperText, Button } from '@mui/material';

export default function WorkspaceSelect({ currentWorkspaceId, handleWorkspaceChange }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  // TODO: change store explicit any to a more defined type
  const localWorkspaces = useSelector((store: any) => store.business.collections);
  // TODO: tie this to the onclick for the menuitem
  // const addCollectionToReqResContainer = () => {
  //   props.collectionToReqRes(props.content.reqResArray);
  //   setWorkspaceTab('workspace');
  // };

  const collectionToReqRes = (reqResArray) => {
    dispatch(actions.collectionToReqRes(reqResArray));
  }

  const menuItems = [];
  for (let workspace of localWorkspaces) {
    console.log(workspace)
    menuItems.push(
      <WorkspaceContextMenu
        key={workspace.id}
        id={workspace.id}
        name={workspace.name}
        reqResArray={workspace.reqResArray}
      />
      // <MenuItem
      //   key={workspace.id}
      //   value={workspace.id}
      //   onClick={() => collectionToReqRes(workspace.reqResArray)}
      // >
      //   {workspace.name}
      // </MenuItem>
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
          <WorkspaceContextMenu />
        </Select>
        <FormHelperText>Current Workspace</FormHelperText>
      </FormControl>
      <ImportWorkspaceModal open={open} handleClose={handleClose}/>
    </Box>
  )
}
