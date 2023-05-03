import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../../controllers/historyController';
// Import local components

/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */

import GRPCTypeAndEndpointEntryForm from './GRPCTypeAndEndpointEntryForm';
import HeaderEntryForm from '../new-request/HeaderEntryForm';
import GRPCProtoEntryForm from './GRPCProtoEntryForm';
import NewRequestButton from '../new-request/NewRequestButton';
import TestEntryForm from '../new-request/TestEntryForm';

import { $TSFixMe, ReqRes } from '../../../../types.js';

// Import MUI components
import { Box } from '@mui/material';

export default function GRPCComposer(props: $TSFixMe) {

  // destructure the props from mainContainer
  const {
    composerFieldsReset,
    fieldsReplaced,
    newRequestFields,
    newRequestFields: {
      gRPC,
      url,
      webrtc,
      protocol,
      graphQL,
      restUrl,
      wsUrl,
      gqlUrl,
      grpcUrl,
      network,
      testContent,
    },
    newRequestBodySet,
    newTestContentSet,
    newRequestBody,
    newRequestBody: { rawType, bodyType },
    newRequestHeadersSet,
    newRequestHeaders,
    newRequestHeaders: { headersArr },
    newRequestCookiesSet,
    newRequestCookies: { cookiesArr },
    newRequestStreamsSet,
    newRequestStreams,
    newRequestStreams: {
      selectedService,
      selectedRequest,
      selectedPackage,
      streamingType,
      initialQuery,
      streamsArr,
      streamContent,
      services,
      protoPath,
      protoContent,
    },
    newRequestSSE: { isSSE },
    currentTab,
    setWarningMessage,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

  // Initialize local state 

  // used to set up boiler plate for StreamsArr
  // is is initially -> []
  // but needs to be -> [{id:0, "query": ""}]
  const [streamsArrLength, setStreamsArrayLength] = useState(newRequestStreams.streamsArr.length);


  const requestValidationCheck = () => {
    interface ValidationMessage {
      uri?: string;
    }
    const validationMessage: ValidationMessage = {};
    //Error conditions...
    if (newRequestFields.grpcUrl) return true;
    validationMessage.uri = 'Enter a valid URI';
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }

    // saves all stream body queries to history & reqres request body
    let streamQueries = '';
    for (let i = 0; i < streamContent.length; i++) {
      // queries MUST be in format, do NOT edit template literal unless necessary
      streamQueries += `${streamContent[i]}`;
    }
    // define array to hold client query strings
    const queryArrStr = streamContent;
    const queryArr = [];
    // scrub client query strings to remove line breaks
    // convert strings to objects and push to array
    for (let i = 0; i < queryArrStr.length; i += 1) {
      let query = queryArrStr[i];
      const regexVar = /\r?\n|\r|↵/g;
      query = query.replace(regexVar, '');
      queryArr.push(JSON.parse(query));
    }
    // grabbing streaming type to set method in reqRes.request.method
    const grpcStream = document.getElementById('stream').innerText;

    // create reqres obj to be passed to controller for further actions/tasks
    const reqRes: ReqRes = {
      id: uuid(),
      createdAt: new Date(),
      protocol: '',
      url,
      graphQL,
      gRPC,
      webrtc,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      request: {
        method: grpcStream,
        headers: headersArr.filter((header) => header.active && !!header.key),
        body: streamQueries,
        bodyType,
        rawType,
        network,
        restUrl,
        wsUrl,
        gqlUrl,
        testContent: testContent || '',
        grpcUrl,
      },
      response: {
        cookies: [],
        headers: {},
        stream: null,
        events: [],
      },
      checked: false,
      minimized: false,
      tab: currentTab,
      service: selectedService,
      rpc: selectedRequest,
      packageName: selectedPackage,
      streamingType,
      queryArr,
      initialQuery,
      streamsArr,
      streamContent,
      servicesObj: services,
      protoPath,
      protoContent,
    };

    // add request to history
    /** @todo Fix TS error */
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);

    //reset for next request
    composerFieldsReset();

    // triggers the reset for the boiler plate for streamsArr
    // if not triggered, composerFieldsReset() breaks feature
    // look at useEffect below
    setStreamsArrayLength(0)
  
    // GRPC REQUESTS
    newRequestBodySet({
      ...newRequestBody,
      bodyType: 'GRPC',
      rawType: '',
    });
    fieldsReplaced({
      ...newRequestFields,
      url: grpcUrl,
      grpcUrl,
    });

    setWorkspaceActiveTab('workspace');
  };

  // need this to make sure 
  useEffect(() => {
    if (streamsArrLength === 0) {

      const newStreamsArr = [
        {
          id: newRequestStreams.count,
          query: '',
        },
      ];

      // reset the state
      setStreamsArrayLength(newStreamsArr.length)

      // update state in the store
      newRequestStreamsSet({
        streamsArr: newStreamsArr,
        count: newStreamsArr.length,
        streamContent: newRequestStreams.streamContent,
      });
    }
  }, [streamsArrLength]);

  const HeaderEntryFormStyle = {
    //trying to change style to conditional created strange duplication effect when continuously changing protocol
    display: !/wss?:\/\//.test(protocol) ? 'block' : 'none',
  };

  return (
    <Box
      className="is-flex-grow-3 add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="composer-grpc"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll container-margin"
        style={{ overflowX: 'hidden' }}
      >
        {/**@todo Fix TSX typing errors */}
        <GRPCTypeAndEndpointEntryForm
          newRequestFields={newRequestFields}
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          fieldsReplaced={fieldsReplaced}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
          newRequestCookiesSet={newRequestCookiesSet}
          newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          setWarningMessage={setWarningMessage}
        />
        <HeaderEntryForm
          stylesObj={HeaderEntryFormStyle}
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
        />
        <GRPCProtoEntryForm
          newRequestStreams={newRequestStreams}
          newRequestStreamsSet={newRequestStreamsSet}
        />
        <TestEntryForm
          newTestContentSet={newTestContentSet}
          testContent={testContent}
        />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </Box>
  );
}
