import React from 'react';
// Import MUI components
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// export interface SimpleDialogProps {
//   open: boolean;
//   selectedValue: string;
//   onClose: (value: string) => void;
// }

export default function ExportToGithubDialog({ allUserRepos, selectedRepo, open, onClose}) {
  // const { onClose, selectedValue, open } = props;
  
  const handleClose = () => {
    onClose(selectedRepo);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const repoListItems = []
  for (let repo of allUserRepos) {
    repoListItems.push(
      <ListItem>
        <ListItemText primary={repo.repository.full_name} />
      </ListItem>
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