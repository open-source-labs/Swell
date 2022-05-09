import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginStatus from './LoginStatus';
import githubController from '../../controllers/githubController';
import Cookies from 'js-cookie';
import axios from 'axios';

import GitHubButton from 'react-github-btn'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Stack, Divider } from '@mui/material';

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

  const pages = [
    { name: 'HTTP2', route: '/' },
    { name: 'GRAPHQL', route: '/graphql' },
    { name: 'GRPC', route: '/grpc' },
    { name: 'WEB SOCKET', route: '/websocket' },
    { name: 'WEBRTC', route: '/webrtc' },
    { name: 'OPENAPI', route: '/openapi' },
    { name: 'WEBHOOK', route: '/webhook' },
  ]

  return(
    <AppBar sx={{ position: 'static' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LoginStatus session={session} setSession={setSession}/>
          <Box 
            key="page-selector"
            sx={{ 
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {pages.map((page) => (
              <Link 
                key={page.name}
                to={page.route}
                >
                <Button
                  key={page.name}
                  variant="contained"
                  color="primary"
                  sx={{
                    m: 1
                  }}>
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>
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
