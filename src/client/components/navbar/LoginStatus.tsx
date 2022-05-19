import React from 'react';
import Cookies from 'js-cookie';

import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2)',
      opacity: 0,
    },
  },
}));

export default function LoginContainer(props) {
  const { session, setSession } = props;

  const signInViaGitHub = async () => {
    const url = `http://github.com/login/oauth/authorize?scope=repo&redirect_uri=http://localhost:3000/signup/github/callback/&client_id=6e9d37a09ab8bda68d50`
    window.location.href = url;
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
    <Box sx={{
      display: 'flex',
      alignContent: 'left',
      flexDirection: 'row',
      pl: 1.5
    }}>
      {session.isActiveSession
        ?
        <Box sx={{
          flexGrow: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Button
            sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
            onClick={handleSignOut}
          >
            <LogoutRoundedIcon fontSize='small' />
          </Button>
          <StyledBadge
            sx={{
              m: 1,
            }}
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            variant="dot">
            <Avatar alt={session.username} src={session.avatar}/>
          </StyledBadge>
          {/* <Button variant="outlined">Invite +</Button> */}
        </Box>
        :
        <Box sx={{
          flexGrow: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Button variant="outlined" onClick={signInViaGitHub}>Sign In</Button>
        </Box>
      }
    </Box>
  );
}
