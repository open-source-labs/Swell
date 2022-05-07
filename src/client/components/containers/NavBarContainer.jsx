import React, { useState, useEffect } from 'react';
import LoginContainer from './LoginContainer';
import githubController from '../../controllers/githubController';
import Cookies from 'js-cookie';
import axios from 'axios';

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

  return(
    <div 
      className="
        is-flex
        is-flex-direction-row
        is-justify-content-space-around
        is-align-items-center
        mt-3"
      id="navbar"
    >
      <LoginContainer session={session} setSession={setSession}/>      
      Swell
      <button>
        Star This Repository
      </button>
    </div>
  );
} 

export default NavBarContainer;
