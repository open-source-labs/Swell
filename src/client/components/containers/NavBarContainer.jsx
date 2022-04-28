import React from 'react';
import axios from 'axios';

const NavBarContainer = (props) => {
  const signInViaGitHub = () => {
    window.location = 'http://localhost:3000/api/login';
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