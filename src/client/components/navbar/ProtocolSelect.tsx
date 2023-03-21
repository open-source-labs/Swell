import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { RootState } from '../../toolkit-refactor/store';

// Import actions so that the navbar can interact with the Redux store.
import * as ReqResSlice from '../../toolkit-refactor/reqRes/reqResSlice';
import {
  newRequestContentByProtocol
} from '../../toolkit-refactor/newRequest/newRequestSlice';


import {
  newRequestFieldsByProtocol
} from '../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';


// Import MUI components.
import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { useDispatch } from 'react-redux';

const blue = {
  500: '#373f51', //text for top buttons
  600: '#95ceed',
  700: '#7ebdde',
  800: '#3730a3',
  900: '#1e3a8a'
};

const white = {
  500: '#f0f6fa',
};

const CustomButton = styled(ButtonUnstyled)`
  font-family: "Source Sans Pro", sans-serif;
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
    color: white;
    background-color: #58a4b0;
  }

  &:active {
    color: white;
    background-color:  #58a4b0;
    box-shadow: inset 0px 0px 4px #ff3000;
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

const pages = [
  { name: 'HTTP/2', route: '/', value: 'rest' },
  { name: 'GraphQL', route: '/graphql', value: 'graphQL' },
  { name: 'gRPC', route: '/grpc', value: 'grpc' },
  { name: 'WebSocket', route: '/websocket', value: 'ws' },
  { name: 'WebRTC', route: '/webrtc', value: 'webrtc' },
  { name: 'OpenAPI', route: '/openapi', value: 'openapi' },
  { name: 'Webhook', route: '/webhook', value: 'webhook' },
  { name: 'tRPC', route: '/trpc', value: 'tRPC'},
];

/**
 * ProtocolSelect is a component in the navbar that alters the redux store based on the protocol that is selected.
 * It is responsible for kicking off the process of creating default values for the composer containers.
 * Click a protocol button -> Alter the Redux store accordingly -> Route to the appropriate "main" container
 */
/**@todo - refactor below function to be more DRY */

function ProtocolSelect() {

  const dispatch = useDispatch()
  /**
   * Alters the Redux store when a protocol is selected.
   * @param network
   */
  const onProtocolSelect = (network: string) => {
    
    dispatch(newRequestFieldsByProtocol(network))
    dispatch(newRequestContentByProtocol(network))
  };

  const [curPage, setCurPage] = useState('');
  const handleClick = (page: {name: string; route: string; value: string}) => {
    setCurPage(page.name)
  }
 
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
      {pages.map((page) => (
        <Link key={page.name} to={page.route} >
          {page.name === curPage ? 
            <SelectedButton
              key={page.name}
              onClick={() => {
                onProtocolSelect(page.value);
                handleClick(page);
              }}
              sx={{
                m: 1,
              }}>
                {page.name}
            </SelectedButton>
          :
            <CustomButton
              key={page.name}
              onClick={() => {
                onProtocolSelect(page.value);
                handleClick(page);
              }}
              sx={{
                m: 1,
              }}>
                {page.name}
            </CustomButton>
          }
        </Link>
      ))}
    </Box>
  );
}
export default ProtocolSelect;

