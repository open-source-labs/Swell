import React, { useReducer, useState } from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
// Import local components
import TRPCMethodAndEndpointEntryForm from './TRPCMethodAndEndpointEntryForm';
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
// Import Actions from RTK slice

import historyController from '../../../controllers/historyController';
import connectionController from '../../../controllers/reqResController';

// Import MUI components
import { Box } from '@mui/material';
import { RootState } from '../../../toolkit-refactor/store';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';
import CookieEntryForm from '../sharedComponents/requestForms/CookieEntryForm';
import TRPCProceduresContainer from './TRPCProceduresContainer';

import TRPCSubscriptionContainer from './TRPCSubscriptionContainer';
import { responseDataSaved } from '../../../toolkit-refactor/slices/reqResSlice';

/**
 *
 */

const PROCEDURE_DEFAULT = {
  method: 'QUERY',
  endpoint: '',
  variable: '',
};

// {type:"",payload:{index,value}}

function reducer(procedures, action) {
  if (action.type === 'METHOD') {
    const proceduresCopy = [...procedures];
    const procedure = proceduresCopy[action.payload.index];
    const newState = {
      ...procedure,
      method: action.payload.value,
    };
    proceduresCopy[action.payload.index] = newState;
    return proceduresCopy;
  } else if (action.type === 'ENDPOINT') {
    const proceduresCopy = [...procedures];
    const procedure = proceduresCopy[action.payload.index];
    const newState = {
      ...procedure,
      endpoint: action.payload.value,
    };
    proceduresCopy[action.payload.index] = newState;
    return proceduresCopy;
  } else if (action.type === 'VARIABLE') {
    const proceduresCopy = [...procedures];
    const procedure = proceduresCopy[action.payload.index];
    const newState = {
      ...procedure,
      variable: action.payload.value,
    };
    proceduresCopy[action.payload.index] = newState;
    return proceduresCopy;
  } else if (action.type === 'ADD') {
    const proceduresCopy = [...procedures];
    proceduresCopy.push(PROCEDURE_DEFAULT);
    return proceduresCopy;
  } else if (action.type === 'DELETE') {
    const proceduresCopy = [...procedures];
    proceduresCopy.splice(action.payload.index, 1);
    return proceduresCopy;
  }
  return procedures;
}

export default function TRPCComposer(props) {
  const dispatch = useDispatch();

  const [showSubscription, setShowSubscription] = useState(false);
  const subscriptionHandler = (bool) => {
    setShowSubscription(bool);
  };
  const [procedures, proceduresDipatch] = useReducer(reducer, [
    PROCEDURE_DEFAULT,
  ]);

  const {
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
      network,
      method,
    },
    newRequestBody,
    newRequestBody: { rawType, bodyType },
    newRequestHeadersSet,
    newRequestHeaders,
    newRequestCookies,
    newRequestCookiesSet,
    newRequestCookies: { cookiesArr },
    newRequestStreamsSet,
    newRequestStreams,
    currentTab,
    setWarningMessage,
    reqResItemAdded,
  } = props;

  /** newRequestFields slice from redux store, contains general request info*/
  const requestFields = useSelector(
    (state: RootState) => state.newRequestFields
  );

  /** reqRes slice from redux store, contains request and response data */
  const newRequest = useSelector((state: RootState) => state.newRequest);

  const addProcedures = () => {
    proceduresDipatch({ type: 'ADD' });
  };

  const dispatchTRPCResponse = (tRPCResponse) => {
    const newCurrentResponse: any = {
      checkSelected: false,
      checked: false,
      connection: 'closed',
      connectionType: 'plain',
      createdAt: new Date(),
      gRPC: false,
      graphQL: false,
      host: requestFields.url,
      id: uuid(),
      minimized: false,
      path: '/',
      protoPath: undefined,
      protocol: 'http://',
      request: { ...newRequest },
      tab: undefined,
      timeReceived: null,
      timeSent: null,
      url: requestFields.url,
      webrtc: false,
      response: {
        events: [tRPCResponse],
      },
    };
    dispatch(responseDataSaved(newCurrentResponse));
  };

  const sendRequest = async () => {
    const id = uuid();
    const headers = newRequest.newRequestHeaders.headersArr.filter(
      (x) => x.active
    );
    const cookie = cookiesArr.filter((x) => x.active);
    const reqRes = {
      id,
      createdAt: new Date(),
      protocol,
      trpc: true,
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
        method,
        headers,
        procedures,
        bodyType,
        rawType,
        network,
        restUrl,
        wsUrl,
        gqlUrl,
        cookie,
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
    };

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);

    //reset for next request
    // composerFieldsReset();
    // connectionController.openReqRes(reqRes.id);
    dispatch(responseDataSaved(reqRes));
    connectionController.openReqRes(reqRes.id);
  };

  return (
    <Box
      className="is-flex is-flex-direction-column is-justify-content-space-between"
      sx={{ height: '100%', width: '100%' }}
      id="composer-trpc"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll container-margin"
        style={{ overflowX: 'hidden' }}
      >
        <TRPCMethodAndEndpointEntryForm
          subscriptionHandler={subscriptionHandler}
        />

        <HeaderEntryForm
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
        />
        <CookieEntryForm
          newRequestCookies={newRequestCookies}
          newRequestBody={newRequestBody}
          newRequestCookiesSet={newRequestCookiesSet}
        />
        <TRPCProceduresContainer
          procedures={procedures}
          proceduresDipatch={proceduresDipatch}
        />
        <button
          className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
          type="button"
          style={{ margin: '10px' }}
          onClick={addProcedures}
        >
          Add Procedure
        </button>
        {!showSubscription && (
          <button
            className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
            type="button"
            style={{ margin: '10px' }}
            onClick={() => {
              setShowSubscription(true);
            }}
          >
            Add Subscription
          </button>
        )}

        <SendRequestButton onClick={sendRequest} />
        {showSubscription && (
          <div>
            <TRPCSubscriptionContainer
              subscriptionHandler={subscriptionHandler}
              setWarningMessage={setWarningMessage}
              procedures={procedures}
              proceduresDipatch={proceduresDipatch}
              requestFields={requestFields}
            ></TRPCSubscriptionContainer>
          </div>
        )}
      </div>
    </Box>
  );
}

