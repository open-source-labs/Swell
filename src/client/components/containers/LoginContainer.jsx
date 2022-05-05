import React from 'react';
import Cookies from 'js-cookie';

const LoginContainer = (props) => {
  const { session, setSession } = props;

  const signInViaGitHub = async () => {
    const url = `http://github.com/login/oauth/authorize?scope=repo&redirect_uri=http://localhost:3000/signup/github/callback/&client_id=6e9d37a09ab8bda68d50` 
    window.location = url;
    // console.log(getCookie());
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

  // const getCookie = async () => {
  //   const self = this;
  //   console.log('hello');
  //   self.window.webContents.session.cookies.get({ }, (error, cookies) => {
  //     if (error) throw error;
  //     self.cookies = cookies;
  //     // console.log('cookies', cookies)
  //     return cookies;
  //   });
  // }

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
          <img style={{ maxHeight: '20px' }} src={session.avatar}/>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
        : <button onClick={signInViaGitHub}>Sign In via Github</button>
      }
    </div>
  );
}

export default LoginContainer;