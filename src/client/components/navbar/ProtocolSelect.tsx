import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { RootState } from '../../toolkit-refactor/store';

// Import actions so that the navbar can interact with the Redux store.
import * as ReqResSlice from '../../toolkit-refactor/reqRes/reqResSlice';
import {
  composerFieldsReset,
  newRequestSSESet,
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
  newRequestContentByProtocol
} from '../../toolkit-refactor/newRequest/newRequestSlice';
import { openApiRequestsReplaced } from '../../toolkit-refactor/newRequestOpenApi/newRequestOpenApiSlice';

import { setWorkspaceActiveTab } from '../../toolkit-refactor/ui/uiSlice';
import {
  fieldsReplaced,
  newTestContentSet,
  newRequestFieldsByProtocol
} from '../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';
import { setWarningMessage } from '../../toolkit-refactor/warningMessage/warningMessageSlice';

// Import MUI components.
import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from '@mui/base/ButtonUnstyled';
import { useDispatch } from 'react-redux';

const blue = {
  500: '#51819b',
  600: '#95ceed',
  700: '#7ebdde',
  800: '#3730a3',
  900: '#1e3a8a'
};

const white = {
  500: '#f0f6fa',
};

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
    background-color: ${blue[600]};
  }


  &.${buttonUnstyledClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1),
      0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectedButton = styled(CustomButton)`
  box-sizing: content-box;
  color: black;
  background-color: ${blue[700]};
  border-bottom: 4px solid ${blue[900]}  ;
  border-radius: 3px;
  font-size: 1.0rem;
  
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
    /**@todo update warning message with hooks*/

    // if (props.warningMessage.uri) {
    //   const warningMessage = { ...props.warningMessage };
    //   delete warningMessage.uri;
    //   props.setWarningMessage({ ...warningMessage });
    // }
    // props.setWarningMessage({});
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
              // variant="contained"
              // color="primary"
              onClick={() => {
                console.log(page.value);
                onProtocolSelect(page.value);
                handleClick(page);
              }}
              sx={{
                m: 1,
              }}
              >
                {page.name}
            </SelectedButton>
          :
            <CustomButton
              key={page.name}
              // variant="contained"
              // color="primary"
              onClick={() => {
                console.log(page.value);
                onProtocolSelect(page.value);
                handleClick(page);
              }}
              sx={{
                m: 1,
              }}
              >
                {page.name}
            </CustomButton>
          }
        </Link>
      ))}
    </Box>
  );
}
export default ProtocolSelect;
// export default connect(mapStateToProps, mapDispatchToProps)(ProtocolSelect);

