import React from 'react';
import { useAppSelector } from '~/toolkit/store';
import collectionsController from '~/controllers/collectionsController';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1,
  justifyContent: 'space-around',
};

export default function ExportWorkspaceModal({ open, handleClose }) {
  const localWorkspaces = useAppSelector((store) => store.collections);
  const isDark = useAppSelector((state) => state.ui.isDark);

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
          <Typography
            id="export-workspace-modal-title"
            variant="h6"
            component="h2"
          >
            Export to
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              collectionsController.exportCollection(localWorkspaces)
            }
          >
            Files
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

