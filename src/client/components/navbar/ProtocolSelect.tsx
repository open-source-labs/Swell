import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import actions so that the navbar can interact with the Redux store.
import { newRequestContentByProtocol } from '../../toolkit-refactor/newRequest/newRequestSlice';
import { newRequestFieldsByProtocol } from '../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';

// Import MUI components.
import { styled } from '@mui/system';
import {
  Box,
  Divider,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses,
} from '@mui/material';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { useDispatch } from 'react-redux';
import { SwellTooltip } from '../customMuiStyles/tooltip';

interface color {
  [key: number]: string;
}

interface page {
  name: string;
  route: string;
  value: string;
}

const blue: color = {
  500: '#373f51', //text for top buttons
  600: '#95ceed',
  700: '#7ebdde',
  800: '#3730a3',
  900: '#1e3a8a',
};

const white: color = {
  500: '#f0f6fa',
};

const CustomButton = styled(ButtonUnstyled)`
  font-family: 'Source Sans Pro', sans-serif;
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

  &:hover,
  &:active {
    color: white;
    background-color: #58a4b0;
  }
`;

const SelectedButton = styled(CustomButton)`
  color: white;
  background-color: #58a4b0;
`;

/**
 * name: The display name for the button.
 * route: The React Router route to redirect to on click.
 * value: The value of the button used to update the Redux store.
 */
const pages: page[] = [
  { name: 'HTTP/2', route: '/', value: 'rest' },
  { name: 'GraphQL', route: '/graphql', value: 'graphQL' },
];

const experimentalPages: page[] = [
  { name: 'gRPC', route: '/grpc', value: 'grpc' },
  { name: 'WebSocket', route: '/websocket', value: 'ws' },
  { name: 'WebRTC', route: '/webrtc', value: 'webrtc' },
  { name: 'OpenAPI', route: '/openapi', value: 'openapi' },
  { name: 'Webhook', route: '/webhook', value: 'webhook' },
  { name: 'tRPC', route: '/trpc', value: 'tRPC' },
];

const experimentalTooltipText: string =
  'Feel free to explore the experimental features to the right!';

/**
 * ProtocolSelect is a component in the navbar that alters the redux store based on the protocol that is selected.
 * It is responsible for kicking off the process of creating default values for the composer containers.
 * Click a protocol button -> Alter the Redux store accordingly -> Route to the appropriate "main" container
 */
function ProtocolSelect() {
  const dispatch = useDispatch();
  /**
   * Alters the Redux store when a protocol is selected.
   * @param network
   */
  const onProtocolSelect = (network: string) => {
    dispatch(newRequestFieldsByProtocol(network));
    dispatch(newRequestContentByProtocol(network));
  };
  const [curPage, setCurPage] = useState('');

  const handleClick = (value: string, name: string): void => {
    onProtocolSelect(value);
    setCurPage(name);
  };

  const createButtons = (pageArray: page[]): JSX.Element[] => {
    return pageArray.map(({ name, route, value }: page) => (
      <Link className="no-focus-outline" key={name} to={route}>
        {name === curPage ? (
          <SelectedButton
            key={name}
            onClick={() => handleClick(value, name)}
            sx={{ m: 1 }}
          >
            {name}
          </SelectedButton>
        ) : (
          <CustomButton
            key={name}
            onClick={() => handleClick(value, name)}
            sx={{ m: 1 }}
          >
            {name}
          </CustomButton>
        )}
      </Link>
    ));
  };

  return (
    <Box
      key="page-selector"
      sx={{
        flexGrow: 1,
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {createButtons(pages)}
      <Divider sx={{ ml: 1 }} orientation="vertical" flexItem />
      <SwellTooltip title={experimentalTooltipText}>
        <ScienceRoundedIcon
          sx={{
            ml: 1.5,
            mr: 1,
            color: `${white[500]}`,
            '&:hover': { color: '#58a4b0' },
          }}
        />
      </SwellTooltip>
      {createButtons(experimentalPages)}
    </Box>
  );
}
export default ProtocolSelect;
