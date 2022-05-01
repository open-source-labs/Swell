import React from 'react';
import axios from 'axios';
// import path, {dirname} from 'path';
// const __dirname = dirname(fileURLToPath(import.meta.url));
// import { ipcRenderer } from 'electron';

const NavBarContainer = (props) => {
  const signInViaGitHub = async () => {
    window.api.send('login-via-github');
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