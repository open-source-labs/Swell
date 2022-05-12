import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1
};

export default function SaveWorkspaceModal({ open, handleClose }) {
  return (
    <Modal
      aria-labelledby="save-workspace-modal"
      aria-describedby="save-current-workspace"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>

        <Box sx={style}>
          <Typography id="save-workspace-modal-title" variant="h6" component="h2">
            Save As
          </Typography>
          <Typography id="save-workspace-modal-description" sx={{ mt: 1 }}>
            Put the original app's save workspace functionality here. Maybe there can be two options: save, and save+commit.
          </Typography>
        </Box>
        
      </Fade>
    </Modal>
  );
}