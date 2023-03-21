import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
// Import controllers.
import githubController from '../../controllers/githubController';
// Import MUI components
import { Box } from '@mui/material';
// Import local components.
import ProtocolSelect from './ProtocolSelect';
import LoginStatus from './LoginStatus';
import GeneralInfo from './GeneralInfo';

export default function NavBarContainer(props) {
  const [session, setSession] = useState({
    username: null,
    avatar: null,
    teams: [],
    currentTeam: null,
    isActiveSession: false,
  });

  // Upon logging in, verify that the user's GitHub access token is still valid.
  useEffect(() => {
    const checkAuth = async (token) => {
      const response = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${token}` },
      });
      if (response.headers['x-oauth-scopes'] === 'repo') {
        setSession((session) => ({
          ...session,
          avatar: response.data.avatar_url,
          username: response.data.login,
          isActiveSession: true,
        }));
        // The below console log is helpful for debugging and determining when a user has an active session.
        // console.log(`-------ACTIVE SESSION--------\nuser: ${response.data.login}\ntoken: ${token}`);
        // Get user data here and send to IndexedDB
        const userData = await githubController.getUserData(token);
        githubController.saveUserDataToDB(userData, token);
      }
    };
    // If there is an auth cookie (which is set in the server file), check if the token is still valid.
    const { auth } = Cookies.get();
    if (auth) {
      checkAuth(auth);
    }
  }, []);

  // bgcolor: '#e0e0e0'

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row', bgcolor: '#4f5a74' }}
      width="100%"
    >
      {/* Login status for the user. */}
      <LoginStatus session={session} setSession={setSession} />
      {/* Protocol select buttons. */}
      <ProtocolSelect />
      {/* General information about Swell. */}
      <GeneralInfo />
    </Box>
  );
}
