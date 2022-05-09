import * as React from 'react';
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

export default function ExportWorkspaceModal({ open, handleClose }) {
  return (
    <Modal
      aria-labelledby="export-workspace-modal"
      aria-describedby="export-current-workspace"
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
          <Typography id="export-workspace-modal-title" variant="h6" component="h2">
            Import From
          </Typography>
          <Typography id="export-workspace-modal-description" sx={{ mt: 1 }}>
            Import from file system, or import from GitHub.
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}