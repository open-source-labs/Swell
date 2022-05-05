import React from 'react';
import Cookies from 'js-cookie';
import { Button } from '@mui/material';

const LoginContainer = (props) => {
  const { session, setSession } = props;

  const signInViaGitHub = async () => {
    const url = `http://github.com/login/oauth/authorize?scope=repo&redirect_uri=http://localhost:3000/signup/github/callback/&client_id=6e9d37a09ab8bda68d50` 
    window.location = url;
  }

  const handleSignOut = () => {
    const endSessionLog = `--------ENDING SESSION--------\nuser: ${session.username}\ntoken: ${Cookies.get('auth')}\nSESSION ENDED`;
    setSession({
      username: null,
      avatar: null,
      teams: [],
      currentTeam: null,
      isActiveSession: false,
    });
    console.log(endSessionLog);
  }

  return(
    <div
      className="
        is-flex
        is-flex-direction-row
        is-justify-content-space-around
        is-align-items-center
        mt-3"
      id="login"
    >
      {session.isActiveSession
        ? 
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
        : <Button variant="contained" onClick={signInViaGitHub}>Sign In via Github</Button>
      }
    </div>
  );
}

export default LoginContainer;