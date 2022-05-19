import React from "react";
import { Button } from '@mui/material';
import { PersonAddAlt1Rounded } from '@mui/icons-material';
import InviteToWorkspaceModal from "../modals/invite-to-workspace/InviteToWorkspaceModal";

export default function ExportWorkspaceButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <div>
      <Button
        variant="text"
        sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
        onClick={handleOpen}>
        <PersonAddAlt1Rounded fontSize="small"/>
      </Button>
      <InviteToWorkspaceModal open={open} handleClose={handleClose}/>
    </div>
  )
}