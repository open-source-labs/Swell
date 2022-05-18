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


// export interface SimpleDialogProps {
//   open: boolean;
//   selectedValue: string;
//   onClose: (value: string) => void;
// }

export default function ExportToGithubDialog({ allUserRepos, workspace, selectedRepo, open, onClose}) {
  // const { onClose, selectedValue, open } = props;
  
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
    collectionsController.exportToGithub(workspace.id, repo.repository.name, repo.sha)
    // 
  }

  console.log(
    'all user repos:', allUserRepos
  )
  const repoListItems = []
  for (let repo of allUserRepos) {
    // console.log('sha', repo.sha);
    repoListItems.push(
      <ListItemButton 
        key={repo.repository.id}
        onClick={() => handleExportToRepo(repo)}
      >
        <ListItem>
          <ListItemText primary={repo.repository.full_name} />
        </ListItem>
      </ListItemButton>
    )
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