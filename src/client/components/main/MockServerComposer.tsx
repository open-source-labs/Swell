// react-redux
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startServer, stopServer } from '../../../client/toolkit-refactor/mockServer/mockServerSlice';

// forms
import RestMethodAndEndpointEntryForm from './new-request/RestMethodAndEndpointEntryForm';
import HeaderEntryForm from './new-request/HeaderEntryForm';
import CookieEntryForm from './new-request/CookieEntryForm';
import BodyEntryForm from './new-request/BodyEntryForm';

// mui
import { Box, Button } from '@mui/material';

/**
 * grab context from Electron window
 * note: api is the ipcRenderer object (see preload.js)
 */
const { api } = (window as any);

// TODO: modify the styling and position of the buttons
// TODO: add typing to the props object
// TODO: add an option to see the list of existing routes that shows up in the response window

const MockServerComposer = (props) => {
  const [userDefinedEndpoint, setUserDefinedEndpoint] = useState('');
  const dispatch = useDispatch();
  
  // grab the isServerStarted state from the Redux store
  let isServerStarted = useSelector((state: any) => state.mockServer.isServerStarted);

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

  // updates the userDefinedEndpoint state when the user types
  const handleEndpointChange = (input: string) => {
    setUserDefinedEndpoint(input);
  };

  // triggers when the user clicks the submit button
  const handleEndpointSubmit = async () => {
    // check if the mock server is running
    if (isServerStarted) {
      // check if endpoint starts with a forward slash
      const parsedUserDefinedEndpoint = 
        userDefinedEndpoint[0] === '/' 
          ? userDefinedEndpoint 
          : `/${userDefinedEndpoint}`;

      // grab the method type from the RestMethodAndEndpointEntryForm component
      const methodType = document.querySelector('#rest-method-type')?.innerHTML;

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
        <RestMethodAndEndpointEntryForm 
          {...props} 
          id="rest-method"
          onEndpointChange={handleEndpointChange}
          placeholder='/Enter Mock Endpoint'
        />
        <HeaderEntryForm {...props} />
        <CookieEntryForm {...props} />
        <BodyEntryForm {...props} /> 
        <Button id="response" variant="contained" color="primary" onClick={handleServerButtonClick}>{isServerStarted ? 'Stop Server' : 'Start Server'}</Button>
        <Button variant="contained" color="primary" onClick={handleEndpointSubmit}>Submit</Button>
      </div>
    </Box>
  )
};

export default MockServerComposer;
