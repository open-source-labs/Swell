import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Backdrop } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import collectionsController from '../../../../controllers/collectionsController';
import githubController from '../../../../controllers/githubController';
import db from '../../../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import SnippetFolderRoundedIcon from '@mui/icons-material/SnippetFolderRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import { Octokit } from 'octokit';
import { collectionAdd } from '../../../../features/business/businessSlice'
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
// import local components
import ExportToGithubList from './ExportToGithubListItem'
import ExportToGithubDialog from './ExportToGitHubDialog';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

export default function ImportExportWorkspaceModal({ open, handleClose }) {
  const [importFromGithubList, setImportFromGithubList] = React.useState(false);
  const [exportToLocalFilesList, setExportToLocalFilesList] = React.useState(false);
  const [exportToGithubList, setExportToGithubList] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  let files = useLiveQuery(() => db.files.toArray());

  const [selectedRepo, setSelectedRepo] = React.useState('');

  const handleImportFromGithubClick = () => {
    setImportFromGithubList(!importFromGithubList)
  }

  const handleExportToFilesClick = () => {
    setExportToLocalFilesList(!exportToLocalFilesList)
  }

  const handleExportToGithubListClick = () => {
    setExportToGithubList(!exportToGithubList)
  }

  files = useLiveQuery(() => db.files.toArray());
  let workspaces = useLiveQuery(() => db.collections.toArray());
  const dispatch = useDispatch();

  const localWorkspaces = useSelector((store: any) => store.business.collections);


  const importFileClick = () => {
    collectionsController.importCollection(localWorkspaces);
  }

  const importFromGithub = async (owner, repo) => {
    const token = await db.auth.toArray();
    const octokit = new Octokit({
      auth: token[0].auth,
    });
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: owner,
        repo: repo,
        path: '.swell',
      }
    );
    const swellFileContents = JSON.parse(
      Buffer.from(response.data.content, 'base64').toString('UTF-8')
    );
    dispatch(collectionAdd(swellFileContents)); //adds to Redux store
    // we also need to save this collection to the Indexed DB under the collections database.
    db.table('collections')
      .put(swellFileContents)
      .catch((err: string) => console.log('Error in addToCollection', err));
    return swellFileContents;
  };


  const swellRepositoriesArray = [];
  if (files !== undefined) {
    for (let file of files) {
      const owner = file.repository.owner.login;
      const repo = file.repository.name;
      swellRepositoriesArray.push(
        <List
          key={file.repository.id}
          component="div"
          disablePadding
        >
          <ListItemButton onClick={() => importFromGithub(owner,repo)} sx={{ pl: 4 }}>
            <ListItemText primary={file.repository.full_name} />
          </ListItemButton>
        </List>
      )
    };
  }

  const exportDbWorkspacesToFiles = [];
  // get an array of all of the collections in the 'collections' table of the IndexedDB
  if(workspaces !== undefined) {
    for (let workspace of workspaces) {
      exportDbWorkspacesToFiles.push(
        <List
          key={workspace.id}
          component="div"
          disablePadding
        >
          <ListItemButton onClick={() => collectionsController.exportToFile(workspace.id)} sx={{ pl: 4 }}>
            <ListItemText primary={workspace.name} />
          </ListItemButton>
        </List>
      )
    }
  }

  const exportDbWorkspacesToGithub = [];
  if(workspaces !== undefined) {
    for (let workspace of workspaces) {
      exportDbWorkspacesToGithub.push(
        <List
          key={workspace.id}
          component="div"
          disablePadding
        >
          <ListItemButton sx={{ pl: 4 }} onClick={() => setDialogOpen(true)}>
            <ListItemText primary={workspace.name} />
          </ListItemButton>
          <ExportToGithubDialog
            allUserRepos={files}
            workspace={workspace}
            selectedRepo={selectedRepo}
            open={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
              handleClose();
            }}
          />
        </List>
      )
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
    p: 1
  };


  return (
<Modal sx={{display: 'flex', alignItems: 'center',justifyContent: 'center'}}
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
      <List >
        {/* Import from files. Opens local file system */}
        <ListItem disablePadding>
          <ListItemButton onClick={importFileClick}>
            <ListItemIcon>
              <SnippetFolderRoundedIcon/>
            </ListItemIcon>
            <ListItemText primary="Import from Files"/>
          </ListItemButton>
        </ListItem>
        {/* Import from Github. Pulls all Swell repos from user's github (which are stored in IndexedDB upon login) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleImportFromGithubClick}>
            <ListItemIcon>
              <GitHubIcon/>
            </ListItemIcon>
            <ListItemText primary="Import from GitHub" />
          {importFromGithubList ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={importFromGithubList} timeout="auto" unmountOnExit>
          {swellRepositoriesArray}
        </Collapse>
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
            <DriveFolderUploadRoundedIcon/>
          </ListItemIcon>
          <ListItemText primary="Export to Files"/>
          {exportToLocalFilesList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={exportToLocalFilesList} timeout="auto" unmountOnExit>
        {exportDbWorkspacesToFiles}
      </Collapse>
      {/**
       * Export to GitHub.
       */}
       <ListItem disablePadding>
        <ListItemButton onClick={handleExportToGithubListClick}>
          <ListItemIcon>
            <GitHubIcon/>
          </ListItemIcon>
          <ListItemText primary="Export to GitHub"/>
          {exportToGithubList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={exportToGithubList} timeout="auto" unmountOnExit>
        {exportDbWorkspacesToGithub}
        {/* We want to render a list of clickable workspaces,
          derived from the IndexedDB. Upon clicking each workspace,
          we want to open a dialog box, allowing the user to choose
          which repo to save it in. */}
        {/* {dbWorkspaces} */}
      </Collapse>
    </List>
    {/* <ExportToGithubListItem workspaces={workspaces} /> */}
  </nav>
  </Box>
  </Fade>
  </Modal>
  );
};
