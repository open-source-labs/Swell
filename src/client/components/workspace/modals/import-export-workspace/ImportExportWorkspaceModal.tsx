import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { useAppSelector } from '../../../../rtk/store';
import collectionsController from '~/controllers/collectionsController';
import db from '~/db';

import { Box, Backdrop } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import SnippetFolderRoundedIcon from '@mui/icons-material/SnippetFolderRounded';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function ImportExportWorkspaceModal({ open, handleClose }) {
  const [exportToLocalFilesList, setExportToLocalFilesList] = useState(false);

  const handleExportToFilesClick = () => {
    setExportToLocalFilesList(!exportToLocalFilesList);
  };

  const localWorkspaces = useAppSelector((store) => store.collections);
  const workspaces = useLiveQuery(() => db.collections.toArray());

  const importFileClick = () => {
    collectionsController.importCollection(localWorkspaces);
  };

  const exportDbWorkspacesToFiles = [];
  // get an array of all of the collections in the 'collections' table of the IndexedDB
  if (workspaces !== undefined) {
    for (let workspace of workspaces) {
      exportDbWorkspacesToFiles.push(
        <List key={workspace.id} component="div" disablePadding>
          <ListItemButton
            onClick={() => collectionsController.exportToFile(workspace.id)}
            sx={{ pl: 4 }}
          >
            <ListItemText primary={workspace.name} />
          </ListItemButton>
        </List>
      );
    }
  }

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
    p: 1,
  };

  return (
    <Modal
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      aria-labelledby="import-export-workspace-modal"
      aria-describedby="import-export-current-workspace"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        {/* sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', }}> */}
        <Box sx={style}>
          <nav aria-label="main mailbox folders">
            {/* List containing Import functionality */}
            <List>
              {/* Import from files. Opens local file system */}
              <ListItem disablePadding>
                <ListItemButton onClick={importFileClick}>
                  <ListItemIcon>
                    <SnippetFolderRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Import from Files" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>

          <Divider />

          <nav aria-label="secondary mailbox folders">
            {/* List containing Export functionality */}
            <List>
              {/**
               * Export whatever files are saved in the IndexedDB to your local file system.
               * Workspaces in this list are pulled from the IndexedDB.
               */}
              <ListItem disablePadding>
                <ListItemButton onClick={handleExportToFilesClick}>
                  <ListItemIcon>
                    <DriveFolderUploadRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Export to Files" />
                  {exportToLocalFilesList ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse
                in={exportToLocalFilesList}
                timeout="auto"
                unmountOnExit
              >
                {exportDbWorkspacesToFiles}
              </Collapse>
            </List>
          </nav>
        </Box>
      </Fade>
    </Modal>
  );
}
