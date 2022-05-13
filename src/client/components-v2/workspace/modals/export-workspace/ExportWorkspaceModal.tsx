import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import collectionsController from '../../../../controllers/collectionsController';
import githubController from '../../../../controllers/githubController';
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
  justifyContent: 'space-around' 
};

export default function ExportWorkspaceModal({ open, handleClose }) {
  let files = useLiveQuery(() => db.files.toArray());
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
            Export to
          </Typography>
          {/* <Box id="import-workspace-modal-description" sx={{ m: 1, webkitJustifyContent: 'space-around', minWidth: 200 }}> */}
              <Button
                variant="contained" size="small" 
                >Files
              </Button>
              <Button
                variant="contained" size="small" 
                >GitHub
              </Button>
          {/* </Box> */}
        </Box>
      </Fade>
    </Modal>
  );
}