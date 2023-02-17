import React from 'react';
import Cookies from 'js-cookie';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';

const blue = {
  500: '#51819b',
  600: '#51819b',
  700: '#7ebdde',
};

const white = {
  500: '#f0f6fa',
}

const CustomButton = styled(ButtonUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: ${white[500]};
  padding: 10px 0px;
  border-radius: 3px;
  color: ${blue[500]};
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
  width: 8vw;

  &:hover {
    background-color: ${blue[500]};
  }

  &.${buttonUnstyledClasses.active} {
    background-color: ${blue[500]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      fontWeight: 'bold',
    },
}));

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
          <LightTooltip title="Logout">
            <Button
              color='secondary'
              sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
              onClick={handleSignOut}>
              <LogoutRoundedIcon fontSize='small' />
            </Button>
          </LightTooltip>
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
          <Button color='secondary' variant="text" onClick={signInViaGitHub} >Sign In</Button>
        </Box>
      }
    </Box>
  );
}
