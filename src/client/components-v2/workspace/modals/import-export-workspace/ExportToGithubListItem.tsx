import React, { useState } from 'react';
// Import MUI components
import Box from '@mui/material/Box';
import List from '@mui/material/ListItem';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function ExportToGithubList({ workspaces }) {
  const [expand, setExpand] = useState(false);
  const handleListButtonClick = () => {
    setExpand(!expand);
  }

  console.log('workspaces', workspaces)
  const workspacesList = [];
  for (let workspace of workspaces) {
    workspacesList.push(
      <ListItem disablePadding>
        <ListItemButton onClick={handleListButtonClick}>
          <ListItemText primary={workspace.name}/>
            {expand ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={expand} timeout="auto" unmountOnExit>
          hello
        </Collapse>
      </ListItem>  
    )
  }

  return(
    {workspacesList}
  )
  
}

{/* <ListItem disablePadding>
<ListItemButton onClick={handleExportToGithubListClick}>
  <ListItemIcon>
    <GitHubIcon/>
  </ListItemIcon>
  <ListItemText primary="Export to GitHub"/>
  {exportToGithubList ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
</ListItem>
<Collapse in={exportToLocalFilesList} timeout="auto" unmountOnExit>
{dbWorkspaces}
</Collapse> */}