import React from "react";
import { Box, Select, SelectChangeEvent, MenuItem, FormControl, FormHelperText } from '@mui/material';
import { useSelector } from 'react-redux';

const WorkspaceSelect = (props) => {
  const [workspace, setWorkspace] = React.useState('home-workspace');

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value as string);
  }

  // TODO: change store explicit any to a more defined type
  const collections = useSelector((store: any) => store.business.collections);
  const menuItems = [];
  for (let workspace of collections) {
    menuItems.push(<MenuItem value={workspace.id}>{workspace.name}</MenuItem>)
  }

  return (
    <Box>
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

export default WorkspaceSelect;