import React from "react";
import { Box, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import { useSelector } from 'react-redux';

export default function WorkspaceSelect({ workspace, handleWorkspaceChange }) {
  // TODO: change store explicit any to a more defined type
  const collections = useSelector((store: any) => store.business.collections);
  const menuItems = [];
  for (let workspace of collections) {
    menuItems.push(<MenuItem key={workspace.id} value={workspace.id}>{workspace.name}</MenuItem>)
  }

  return (
    <Box sx={{mr: 1, flexGrow: 1}}>
      <FormControl 
        fullWidth
        variant="standard">
        <Select
          id="workspace-select"
          label="workspace"
          value={workspace}
          onChange={handleWorkspaceChange}
        >
          <MenuItem value="home-workspace">Home</MenuItem>
          {menuItems}
          {/* TODO: Link this last menu item to a popup for importing a new workspace */}
          <MenuItem value=""><em>Import a new Workspace</em></MenuItem>
        </Select>
        <FormHelperText>Current Workspace</FormHelperText>
      </FormControl>
    </Box>
  )
}