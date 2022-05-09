import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
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

export default function InviteToWorkspaceModal({ open, handleClose }) {
  return (
    <Modal
      aria-labelledby="invite-to-workspace-modal"
      aria-describedby="invite-to-current-workspace"
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
          <Typography id="invite-to-workspace-modal-title" variant="h6" component="h2">
            Invite someone to your current workspace!
          </Typography>
          <Typography id="invite-to-workspace-modal-description" sx={{ mt: 1 }}>
            Still in development.
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}