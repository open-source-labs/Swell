import React from 'react';
// Import controllers
import collectionsController from '../../../../controllers/collectionsController'
// Import MUI components
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// Database handling
import db from '../../../../db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function ExportToGithubDialog({ allUserRepos, workspace, selectedRepo, open, onClose}) {
  let files = useLiveQuery(() => db.files.toArray());
  let repos = useLiveQuery(() => db.repos.toArray());

  const handleClose = () => {
    onClose(selectedRepo);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const handleExportToRepo = (repo) => {
    console.log('need to export this specific file to this clicked-on repo.')
    console.log('workspace to export:', workspace)
    console.log('repo metadata:', repo.repository)
    // grab sha off of current workspace
    let sha = '';
    for(let file of files) {
      if (file.repository.full_name === repo.full_name) {
        sha = file.sha;
      }
    }
    collectionsController.exportToGithub(workspace.id, repo.name, sha)
  }

  const repoListItems = []

  if(repos !== undefined) {
    console.log(repos)
    for (let repo of repos) {
      repoListItems.push(
        <ListItemButton
          key={repo.id}
          onClick={() => handleExportToRepo(repo)}
        >
          <ListItem>
            <ListItemText primary={repo.full_name} />
          </ListItem>
        </ListItemButton>
      )
    }
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select a repository to export to.</DialogTitle>
      <List sx={{ pt: 0 }}>
        {repoListItems}
        {/* <ListItem autoFocus button onClick={() => handleListItemClick}>
          <ListItemText primary="repo" />
        </ListItem > */}
      </List>
    </Dialog>
  );
}
