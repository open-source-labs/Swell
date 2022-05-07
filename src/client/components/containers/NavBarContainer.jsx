import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginContainer from './LoginContainer';
import githubController from '../../controllers/githubController';
import Cookies from 'js-cookie';
import axios from 'axios';
// import swellLogo from '../../../assets/icons/64x64.png';

import GitHubButton from 'react-github-btn'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
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
        const userData = await githubController.getUserData(token);
        githubController.saveUserDataToDB(userData, token)
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
              <Link to={page.route}>
                <Button
                  key={page.name}
                  variant="contained"
                  color="secondary"
                  sx={{
                    m: 1
                  }}>
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ 
            flexGrow: 0,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            m: 1,
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
