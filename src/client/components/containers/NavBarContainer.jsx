import React from 'react';
import jsCookie from 'js-cookie';
import axios from 'axios';
import githubController from '../../controllers/githubController';
// import path, {dirname} from 'path';
// const __dirname = dirname(fileURLToPath(import.meta.url));
// import { ipcRenderer } from 'electron';

const NavBarContainer = (props) => {
  const signInViaGitHub = async () => {
    const url = `http://github.com/login/oauth/authorize?scope=repo&redirect_uri=http://localhost:3000/signup/github/callback/&client_id=6e9d37a09ab8bda68d50` 
    window.location = url;
    const userData = await axios.get('api/getUserData', {
      headers: { Accept: 'application/json', 'Content-Type': 'text/json' },
    })
    console.log('userdata', userData)
    // console.log(getCookie());
    return userData
  }

  const getCookie = async () => {
    const self = this;
    console.log('hello');
    self.window.webContents.session.cookies.get({ }, (error, cookies) => {
      if (error) throw error;
      self.cookies = cookies;
      // console.log('cookies', cookies)
      return cookies;
    });
  }

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
      Swell
      <button>
        Star This Repository
      </button>
      <button onClick={signInViaGitHub}>
        Sign In via GitHub
      </button>
    </div>
  );
} 

export default NavBarContainer;