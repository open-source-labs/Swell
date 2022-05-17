import * as React, { useState }, from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import {collectionAdd} from '../../../../features/business/businessSlice'
import Collapse from '@mui/material/Collapse';


const style = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 1,
    justifyContent: 'space-around',
  };
  
  export default function ImportWorkspaceModal({ open, handleClose }) {
    const [importFromGithubList, setImportFromGithubList] = React.useState(false)

    const handleImportFromGithubClick = () => {
      setImportFromGithubList(!importFromGithubList)
    }

    let files = useLiveQuery(() => db.files.toArray());
    const dispatch = useDispatch();
  
    const localWorkspaces = useSelector((store: any) => store.business.collections);
    console.log('localworkspaces', localWorkspaces);

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

      dispatch(collectionAdd(swellFileContents))
    
    // const newObj = Object.assign({selected: false}, localWorkspaces);
    // console.log('newObj', newObj)
    
      return swellFileContents;
    };

    
    const swellRepositoriesArray = [];
    //if files is undefined, the user has either not signed into github or does not have any .swell files
    if (files !== undefined) {
      for (let file of files) {
        const owner = file.repository.owner.login;
        const repo = file.repository.name;
        // const info = file.repository.reqResArray.url
        swellRepositoriesArray.push(<Button onClick={() => importFromGithub(owner,repo)}> {file.repository.full_name}</Button>)
      };
        }
        
    

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
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={importFileClick}>
              <ListItemIcon>
                <SnippetFolderRoundedIcon/>
              </ListItemIcon>
              <ListItemText primary="Import from Files"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleImportFromGithubClick}> 
              <ListItemIcon>
                <GitHubIcon/>
              </ListItemIcon>
              <ListItemText primary="Import from GitHub" />
            </ListItemButton>

          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
        <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DriveFolderUploadRoundedIcon/>
              </ListItemIcon>
              <ListItemText primary="Export to Files"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GitHubIcon/>
              </ListItemIcon>
              <ListItemText primary="Export to GitHub"/>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      {swellRepositoriesArray}
    </Box>
        </Fade>
 </Modal>
    );
  };
  

//   onClick={() => {
//     alert({swellRepositoriesArray});
//     }}

// onClick={swellRepositoriesArray}