import React from "react";
import { Button } from '@mui/material';
import { SaveRounded } from "@mui/icons-material";
import SaveWorkspaceModal from "../modals/SaveWorkspaceModal";

export default function SaveWorkspaceButton(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <div>
      <Button
        variant="text"
        sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
        onClick={handleOpen}>
        <SaveRounded fontSize="small"/>
      </Button>
      <SaveWorkspaceModal open={open} handleClose={handleClose}/>
    </div>
  )
}