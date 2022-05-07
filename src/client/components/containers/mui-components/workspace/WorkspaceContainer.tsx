import React from "react";
import CurrentWorskpace from "./CurrentWorkspace";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

// MUI components
import { Box, Button, Typography } from '@mui/material';


const WorkspaceContainer = (props) => {
  // TODO: change the workspace container to have adjustable width sizing via user dragging
  // TODO: reimplement the "Schedule" functionality somehow
  return (
    <Box sx={{ minWidth: '20%', align: 'center', p: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CurrentWorskpace />
        <Button variant="text" sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}>
          <SaveRoundedIcon />
        </Button>
        <Button variant="text" sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}>
          <IosShareRoundedIcon fontSize="small"/>
        </Button>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography>Collections</Typography>
        <Button variant="text" sx={{ width: 1, maxHeight: '24px', minHeight: '24px' }}>
          <AddRoundedIcon fontSize="small"/>
        </Button>
      </Box>
    </Box>
  )
}

export default WorkspaceContainer;