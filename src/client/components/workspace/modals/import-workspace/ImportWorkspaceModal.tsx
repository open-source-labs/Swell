import * as React from 'react';
import { useAppSelector } from '~/toolkit/store';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import collectionsController from '../../../../controllers/collectionsController';
import db from '../../../../db';
import { useLiveQuery } from 'dexie-react-hooks';

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

export default function ImportWorkspaceModal({
  open,
  handleClose,
}): JSX.Element {
  let files = useLiveQuery(() => db.files.toArray());
  console.log(files);

  const localWorkspaces = useAppSelector((store) => store.collections);
  const isDark = useAppSelector((state) => state.ui.isDark);

  const swellReposContent = (files ?? []).map((file) => (
    <Box>{file.repository.full_name}</Box>
  ));

  return (
    <Modal
      aria-labelledby="import-workspace-modal"
      aria-describedby="import-current-workspace"
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
            id="import-workspace-modal-title"
            variant="h6"
            component="h2"
          >
            Import from
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              collectionsController.importCollection(localWorkspaces)
            }
          >
            Files
          </Button>
          {swellReposContent}
        </Box>
      </Fade>
    </Modal>
  );
}

