import React, { useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/toolkit/store';
import { responseDataSaved } from '~/toolkit/slices/reqResSlice';

import { v4 as uuid } from 'uuid';

import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
import CookieEntryForm from '../sharedComponents/requestForms/CookieEntryForm';

import TRPCProceduresContainer from './TRPCProceduresContainer';
import TRPCSubscriptionContainer from './TRPCSubscriptionContainer';
import TRPCMethodAndEndpointEntryForm from './TRPCMethodAndEndpointEntryForm';

import historyController from '~/controllers/historyController';
import connectionController from '~/controllers/reqResController';

import { Box } from '@mui/material';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';

const PROCEDURE_DEFAULT = {
  //the default format for whenever a new prcedure get add
  method: 'QUERY', // the type of method either query or mutate
  endpoint: '', // endpoint for this specific procedure
  variable: '', // argument that is to be attach to this procedure
};

//************** reducer function******************** */
//  this function is used to manage the main state of this component which is an array of procedures [{method,endpoint,variable}]
//  it will take in the old state (array of procedures) as well as an action object where the type will dictate which action will get trigger
// The action object wil also contain the index as well as the new value for the procedure that is being manipulated (all inside of action.payload)
// after its done manipulating the state it will return the updated array that will be use as the new procedures state

//********************************** */

function reducer(procedures, action) {
  if (action.type === 'METHOD') {
    //
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
  const dispatch = useAppDispatch();

  const [showSubscription, setShowSubscription] = useState(false); // manage subscription component
  const subscriptionHandler = (bool) => {
    setShowSubscription(bool);
  };

  const requestValidationCheck = () => {
    interface ValidationMessage {
      uri?: string;
      json?: string;
    }
    const validationMessage: ValidationMessage = {};
    // Error conditions...
    if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
      //if url is only http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URI';
    }
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
      //if url doesn't have http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URI';
    }
    return validationMessage;
  };

  const [procedures, proceduresDipatch] = useReducer(reducer, [
    //userReducer hook to manage the main state (the array of procedures)
    PROCEDURE_DEFAULT,
  ]);

  const {
    //grabbing all neccessary information to build a new reqRes object from the main redux store through props drilling
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
    warningMessage,
    reqResItemAdded,
  } = props;

  const requestFields = useAppSelector((store) => store.newRequestFields);
  const newRequest = useAppSelector((store) => store.newRequest);

  const addProcedures = () => {
    // reducer dispatch for adding a new procedure to the procedures array
    proceduresDipatch({ type: 'ADD' });
  };

  const sendRequest = async () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }
    // THE MAIN FUNCTION to both compose the main reqRes object as well as sending it to the back end
    const id = uuid();
    const headers = newRequest.newRequestHeaders.headersArr.filter(
      (x) => x.active
    );
    const cookie = cookiesArr.filter((x) => x.active);
    const reqRes = {
      id,
      createdAt: new Date(),
      protocol,
      tRPC: true,
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

    // saving the reqRes object to the array of reqRes managed by the redux store
    dispatch(responseDataSaved(reqRes));
    connectionController.openReqRes(reqRes.id); // passing the reqRes object to the connectionController inside of reqRes controller
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
          setWarningMessage={setWarningMessage}
          warningMessage={warningMessage}
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

