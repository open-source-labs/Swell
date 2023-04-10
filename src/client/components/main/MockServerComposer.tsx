// react-redux
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startServer, stopServer } from '../../../client/toolkit-refactor/mockServer/mockServerSlice';
import { newRequestFieldsByProtocol } from '../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';

// forms
import RestMethodAndEndpointEntryForm from './new-request/RestMethodAndEndpointEntryForm';
import HeaderEntryForm from './new-request/HeaderEntryForm';
import CookieEntryForm from './new-request/CookieEntryForm';
import BodyEntryForm from './new-request/BodyEntryForm';

// mui
import { Box, Button, styled, Tooltip, TooltipProps, tooltipClasses, Typography } from '@mui/material';

/**
 * grab context from Electron window
 * note: api is the ipcRenderer object (see preload.js)
 */
const { api } = (window as any);

// TODO: add typing to the props object
// TODO: add an option to see the list of existing routes that shows up in the response window
// TODO: add endpoint validation
// TODO: add the ability to mock HTML responses (or remove the HTML option from the BodyEntryForm component)

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const MockServerComposer = (props) => {
  const dispatch = useDispatch();
  
  // grab the isServerStarted state from the Redux store
  let isServerStarted = useSelector((state: any) => state.mockServer.isServerStarted);

  useEffect(() => {
    dispatch(newRequestFieldsByProtocol('mock'));
  }, [dispatch])

  const startMockServer = () => {
    api.send('start-mock-server');
    console.log('server started');
    dispatch(startServer());
  };

  const stopMockServer = () => {
    api.send('stop-mock-server');
    dispatch(stopServer());
    alert('Mock server stopped');
  };

  // toggles the mock server on and off
  const handleServerButtonClick = () => {
    isServerStarted ? stopMockServer() : startMockServer();
  };

  // triggers when the user clicks the submit button
  const handleEndpointSubmit = async () => {
    // check if the mock server is running
    if (isServerStarted) {
      // check if endpoint starts with a forward slash
      const parsedUserDefinedEndpoint = 
        props.newRequestFields.restUrl[0] === '/' 
          ? props.newRequestFields.restUrl 
          : `/${props.newRequestFields.restUrl}`;

      // grab the method type from the RestMethodAndEndpointEntryForm component
      const methodType = props.newRequestFields.method;

      // check if the body is parsable JSON
      try {
        JSON.parse(props.newRequestBody.bodyContent);
      } catch (err) {
        alert('Please enter a JSON parsable body');
      }

      // parse the response from the BodyEntryForm component because it is a stringified JSON object in props
      const parsedCodeMirrorBodyContent = JSON.parse(props.newRequestBody.bodyContent);

      // create an object that contains the method, endpoint, and response
      const postData = {
        method: methodType,
        endpoint: parsedUserDefinedEndpoint,
        response: parsedCodeMirrorBodyContent,
      };
  
      // send a message with the stringified postData to the main_mockServerController to execute the POST request 
      api.send('submit-mock-request', JSON.stringify(postData));

      // TODO: figure out how to populate the response window with a success message and instructions on how to view the mock response. For now it will just alert the user.
      alert(`Endpoint submitted! 
      Please make a request to: 
      http://localhost:9990${parsedUserDefinedEndpoint} to see the response.`);
    } else {
      alert('Please start the mock server before submitting an endpoint');
    }
  }

  console.log(props);

  return (
    <Box
      className="is-flex-grow-3 add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="mockcomposer-http2"
    >
      <div className="container-margin">
        <HtmlTooltip placement="bottom-end" title={
          <>
            <Typography variant="body1">
              <b>To create a mock response:</b>
              <br />
            </Typography>
            <Typography variant="body2">
              1. Click "Start Server".
              <br />
              2. Select a request type from the dropdown.
              <br />
              3. Enter your desired /endpoint.
              <br />
              4. Define your desired response in the body. 
              <br />
              5. Click "Submit".
            </Typography>
            <br />
            <Typography variant="body1">
              <b>To view your response:</b>
            </Typography>
            <Typography variant="body2">
              Make a request to: localhost:9990/yourendpoint
            </Typography>  
          </>
        }
        >
          <div className="is-flex is-align-items-center">
            <Button 
              className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please" 
              id="response" 
              variant="contained" 
              color="primary" 
              onClick={handleServerButtonClick}
              sx={{ mr: 1, textTransform: 'none' }}>
                {isServerStarted ? 'Stop Server' : 'Start Server'}
            </Button>
            <RestMethodAndEndpointEntryForm 
              {...props}
              method={props.newRequestFields.method}
              placeholder='/Enter Mock Endpoint'
            />
          </div>
        </HtmlTooltip>
        <HeaderEntryForm {...props} />
        <CookieEntryForm {...props} />
        <BodyEntryForm {...props} /> 
        <div className="is-flex">
          <Button 
            className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please" 
            variant="contained" 
            color="primary" 
            onClick={handleEndpointSubmit}
            sx={{ ml : 1, textTransform: 'none' }}>
              Submit
          </Button>
        </div>
      </div>
    </Box>
  )
};

export default MockServerComposer;
