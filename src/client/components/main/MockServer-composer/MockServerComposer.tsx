// react-redux
import React, { useState, useEffect } from 'react';
import { type ConnectRouterProps } from '~/components/main/MainContainer';

import { useAppSelector, useAppDispatch } from '~/toolkit/store';
import { startServer, stopServer } from '~/toolkit/slices/mockServerSlice';
import { newRequestFieldsByProtocol } from '~/toolkit/slices/newRequestFieldsSlice';

// forms
import RestMethodAndEndpointEntryForm from '../http2-composer/RestMethodAndEndpointEntryForm';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';
import CookieEntryForm from '../sharedComponents/requestForms/CookieEntryForm';
import BodyEntryForm from '../sharedComponents/requestForms/BodyEntryForm';

// mui
import { Box, Button, Modal, Typography } from '@mui/material';

/**
 * grab context from Electron window
 * note: api is the ipcRenderer object (see preload.js)
 */
const { api } = window as any;

/**
 * Formatted todo's from Chris Suzukida (2023-04-11)
 * @todo Add an option to see the list of existing routes that shows up in the
 *       response window
 * @todo Add endpoint validation
 * @todo Add the ability to mock HTML responses (or remove the HTML option from
 *       the BodyEntryForm component)
 * @todo Hook up the headers and cookies to the mock endpoint creation
 */

// styling for the mui box modal component
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MockServerComposer = (props: ConnectRouterProps) => {
  const [showModal, setShowModal] = useState(false);
  const [userDefinedEndpoint, setUserDefinedEndpoint] = useState('');

  const requestFields = useAppSelector((store) => store.newRequestFields);
  const reqBody = useAppSelector((store) => store.newRequest.newRequestBody);
  const isServerStarted = useAppSelector(
    (store) => store.mockServer.isServerStarted
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(newRequestFieldsByProtocol('mock'));
  }, [dispatch]);

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
    if (isServerStarted) {
      stopMockServer();
    } else {
      startMockServer();
    }
  };

  // triggers when the user clicks the submit button
  const handleEndpointSubmit = async () => {
    // check if the mock server is running
    if (isServerStarted) {
      // check if endpoint starts with a forward slash
      const parsedUserDefinedEndpoint =
        requestFields.restUrl[0] === '/'
          ? requestFields.restUrl
          : `/${requestFields.restUrl}`;

      // grab the method type from the RestMethodAndEndpointEntryForm component
      const methodType = requestFields.method;

      // check if the body is parsable JSON
      try {
        JSON.parse(reqBody.bodyContent);
      } catch (err) {
        alert('Please enter a JSON parsable body');
      }

      // parse the response from the BodyEntryForm component because it is a stringified JSON object in props
      const parsedCodeMirrorBodyContent = JSON.parse(reqBody.bodyContent);

      // create an object that contains the method, endpoint, and response
      const postData = {
        method: methodType,
        endpoint: parsedUserDefinedEndpoint,
        response: parsedCodeMirrorBodyContent,
      };

      // send a message with the stringified postData to the main_mockServerController to execute the POST request
      api.send('submit-mock-request', JSON.stringify(postData));

      setUserDefinedEndpoint(parsedUserDefinedEndpoint);
      setShowModal(true);
    } else {
      alert('Please start the mock server before submitting an endpoint');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // instructions to pass down to the BodyEntryForm component as a placeholder
  const instructions = `
  How to create a mock endpoint:

  1. Click the start server button
  2. Select a method type from the dropdown menu
  3. Enter an endpoint and a response to mock
  4. Click the submit button 
  `;

  return (
    <Box
      className="add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="mockcomposer-http2"
    >
      <div className="is-flex is-flex-direction-column container-margin">
        <div className="is-flex is-align-items-center">
          <Button
            className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
            id="response"
            variant="contained"
            color="primary"
            onClick={handleServerButtonClick}
            sx={{ mr: 1, textTransform: 'none' }}
          >
            {isServerStarted ? 'Stop Server' : 'Start Server'}
          </Button>
          <div className="is-flex-grow-1">
            <RestMethodAndEndpointEntryForm
              {...props}
              method={requestFields.method}
              placeholder="/Enter mock endpoint"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <HeaderEntryForm {...props} />
        <CookieEntryForm {...props} />
        <BodyEntryForm
          isMockServer={true}
          placeholder={instructions}
          {...props}
        />
        <div className="is-flex mt-3">
          <Button
            className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
            variant="contained"
            color="primary"
            onClick={handleEndpointSubmit}
            sx={{ ml: 1, textTransform: 'none' }}
          >
            Submit
          </Button>
          <Modal open={showModal} onClose={handleCloseModal}>
            <Box sx={style} className="is-flex is-flex-direction-column">
              <div>
                <Typography variant="h6">
                  Mock endpoint successfully created!
                  <br />
                  <br />
                  To view the response visit:
                  <br />
                  localhost:9990{userDefinedEndpoint}
                </Typography>
              </div>
              <div className="is-flex is-justify-content-flex-end">
                <Button onClick={handleCloseModal}>Close</Button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </Box>
  );
};

export default MockServerComposer;

