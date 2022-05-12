import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// import Controllers
import githubController from '../../controllers/githubController';

// Import MUI (and packaged) components
import GitHubButton from 'react-github-btn'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Stack, Divider } from '@mui/material';

// Import local components.
import ProtocolSelect from './ProtocolSelect';
import LoginStatus from './LoginStatus';


export default function NavBarContainer(props) {
  const [session, setSession] = useState(
    {
      username: null,
      avatar: null,
      teams: [],
      currentTeam: null,
      isActiveSession: false,
    }
  );

  useEffect(() => {
    const checkAuth = async (token) => {
      const response = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${token}`},
      });
      if (response.headers['x-oauth-scopes'] === 'repo') {
        setSession((session) => ({ ...session,
          avatar: response.data.avatar_url,
          username: response.data.login,
          isActiveSession: true}));
        console.log(`-------ACTIVE SESSION--------\nuser: ${response.data.login}\ntoken: ${token}`);
        // get user data here and send to db
        const userData = await githubController.getUserData(token);
        githubController.saveUserDataToDB(userData, token)
      }
    }

    const { auth } = Cookies.get();
    if (auth) {
      checkAuth(auth);
    }
  }, []);

  return(
    <AppBar sx={{ position: 'static' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LoginStatus session={session} setSession={setSession}/>
          <ProtocolSelect />
          <Box
            key="swell-info"
            sx={{
              flexGrow: 0,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              m: 1
            }}>
            {/* TODO: this GitHub button comes from a component library. Should build your own or find one that supports TS types. */ }
            {/* @ts-ignore:next-line */}
            <GitHubButton href="https://github.com/oslabs-beta/Swell" data-color-scheme="no-preference: dark; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star oslabs-beta/Swell on GitHub">Star</GitHubButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
  }
