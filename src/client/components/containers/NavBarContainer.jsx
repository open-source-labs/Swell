import React from "react";

const NavBarContainer = (props) => {
  const signInViaGitHub = () => {
    console.log('signing in...')
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