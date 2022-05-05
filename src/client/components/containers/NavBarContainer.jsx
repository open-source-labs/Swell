import React, { useState, useEffect } from 'react';
import LoginContainer from './LoginContainer';
import githubController from '../../controllers/githubController';
import Cookies from 'js-cookie';
import axios from 'axios';

import GitHubButton from 'react-github-btn'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

const NavBarContainer = (props) => {
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
        const userData = await axios.get('api/getUserData', {
          headers: { Accept: 'application/json', 'Content-Type': 'text/json' },
        })
        console.log('userdata', userData)
        githubController.saveUserDataToDB(userData.data)
      }
    }

    const { auth } = Cookies.get();
    if (auth) {
      checkAuth(auth);
    }
  }, []);

  const pages = ['HTTP2', 'GRAPHQL', 'GRPC', 'WEB SOCKETS', 'WEBRTC', 'OPENAI', 'WEBHOOKS'];

  return(
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LoginContainer session={session} setSession={setSession}/>
          <Box sx={{ 
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {pages.map((page) => (
              <Button
                key={page}
                variant="contained"
                sx={{
                  m: 1
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ 
            flexGrow: 0,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
          }}>
            <GitHubButton href="https://github.com/oslabs-beta/Swell" data-color-scheme="no-preference: dark; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star oslabs-beta/Swell on GitHub">Star</GitHubButton>
            {/* TODO: add Swell icon next to "Star this Repo" button */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
  } 

export default NavBarContainer;
