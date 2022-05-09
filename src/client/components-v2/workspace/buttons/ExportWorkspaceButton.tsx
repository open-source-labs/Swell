import React from "react";
import { Button } from '@mui/material';
import { IosShareRounded } from "@mui/icons-material";
import ExportWorkspaceModal from "../modals/export-workspace/ExportWorkspaceModal";

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
        <IosShareRounded fontSize="small"/>
      </Button>
      <ExportWorkspaceModal open={open} handleClose={handleClose}/>
    </div>
  )
}