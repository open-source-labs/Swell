import React from 'react';
import Cookies from 'js-cookie';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

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

  console.log(session);

  return(
    <div>
      {session.isActiveSession
        ? 
        <div>
          <Avatar alt={session.username} src={session.avatar}/>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>Sign Out</Button>
        </div>
        : <Button variant="contained" color="secondary" onClick={signInViaGitHub}>Sign In via Github</Button>
      }
    </div>
  );
}



{/* <AppBar position="static">
<Container maxWidth="xl">
  <Toolbar disableGutters>
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
    >
      LOGO
    </Typography>

    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      > */}



export default LoginContainer;