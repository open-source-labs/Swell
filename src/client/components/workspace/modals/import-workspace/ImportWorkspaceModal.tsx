import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import collectionsController from '../../../../controllers/collectionsController';
import githubController from '../../../../controllers/githubController';
import db from '../../../../db';
import { useLiveQuery } from 'dexie-react-hooks';

/**@todo delete when slice conversion complete */
import * as actions from '../../../../features/business/businessSlice';
//import * as uiactions from '../../../../features/ui/uiSlice';

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

export default function ImportWorkspaceModal({ open, handleClose }) {
  let files = useLiveQuery(() => db.files.toArray());
  console.log(files);
  const dispatch = useDispatch();

  const localWorkspaces = useSelector((store) => store.business.collections);
  const isDark = useSelector((state) => state.ui.isDark);

  const handleImportFromGithub = async () => {
    const githubWorkspaces = await githubController.importFromRepo();
    collectionsController.importFromGithub([
      ...localWorkspaces,
      ...githubWorkspaces,
    ]);
  };

  const swellRepositoriesArray = [];
  if (files !== undefined) {
    for (let file of files) {
      swellRepositoriesArray.push(<Box> {file.repository.full_name}</Box>);
    }
  }

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
          <Button
            variant="contained"
            size="small"
            onClick={handleImportFromGithub}
            // onClick={files.map((file) => (
            //   <li key={file.repository.full_name}>{file.repository.name}</li>
            // ))}
          >
            GitHub
          </Button>
          {swellRepositoriesArray}
        </Box>
      </Fade>
    </Modal>
  );
}

// {handleImportFromGithub}

