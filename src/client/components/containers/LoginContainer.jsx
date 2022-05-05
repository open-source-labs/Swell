import React from 'react';

const LoginContainer = (props) => {
  const { session } = props;

  const signInViaGitHub = async (event) => {
    // the client_id should not be permanently hard coded?
    const url = `http://github.com/login/oauth/authorize?scope=repo&redirect_uri=http://localhost:3000/signup/github/callback/&client_id=6e9d37a09ab8bda68d50` 
    window.location = url;
    // getCookie()
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
  console.log(session);
  console.log(session.isActiveSession);

  let button;
  if (session.isActiveSession) {
    button = <button>Sign Out</button>
  }
  else {
    button = <button onClick={signInViaGitHub}>Sign In via Github</button>
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
      {button}
    </div>
  );
}

export default LoginContainer;