import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
// import Controllers
import githubController from '../../controllers/githubController';
// Import MUI components
import { AppBar, Divider, Toolbar, Box } from '@mui/material';
// Import local components.
import ProtocolSelect from './ProtocolSelect';
import LoginStatus from './LoginStatus';
import GeneralInfo from './GeneralInfo';


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
    <Box sx={{display: 'flex', flexDirection: 'row'}} width="100%">
      {/* Login status for the user. */}
      <LoginStatus session={session} setSession={setSession}/>
      {/* Protocol select buttons. */}
      <ProtocolSelect />
      {/* General information about Swell. */}
      <GeneralInfo />
    </Box>
  );
  }
