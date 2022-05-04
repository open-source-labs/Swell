import React from 'react';

const LoginContainer = (props) => {
  const signInViaGitHub = async (event) => {
    console.log('session:', props.session);
    console.log('setSession:', props.setSession);
    const url = `http://github.com/login/oauth/authorize?scope=repo&redirect_uri=http://localhost:3000/signup/github/callback/&client_id=6e9d37a09ab8bda68d50` 
    window.location = url;
    // console.log(getCookie());
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
      <button onClick={signInViaGitHub}>
        Sign In via GitHub
      </button>
    </div>
  );
}

export default LoginContainer;