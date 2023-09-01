import React, { useReducer, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useAppDispatch, useAppSelector } from '../../../rtk/store';
import { responseDataSaved } from '../../../rtk/slices/reqResSlice';

import { type ConnectRouterProps } from '~/components/main/MainContainer';

import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
import CookieEntryForm from '../sharedComponents/requestForms/CookieEntryForm';

import TRPCProceduresContainer from './TRPCProceduresContainer';
import TRPCSubscriptionContainer from './TRPCSubscriptionContainer';
import TRPCMethodAndEndpointEntryForm from './TRPCMethodAndEndpointEntryForm';

import historyController from '~/controllers/historyController';
import connectionController from '~/controllers/reqResController';

import { Box } from '@mui/material';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';

/**
 * @todo 2023-08-30 - Decided to refactor a useReducer implementation for
 * clarity. Redux doesn't make useReducer unnecessary – it can be great for
 * handling complex state that only belongs to one component.
 *
 * The problem is that the whole implementation was left half-finished in the
 * component itself, so I don't know where this was meant to go.
 *
 * Logic-wise, nothing has changed. Just need to figure out if this is even
 * necessary, or if the Redux reducer can fulfill a similar purpose. It's
 * possible that the procedure should be using types defined elsewhere, too
 */
type Procedure = Readonly<{
  // Because the default procedure is initialized to the value QUERY, I don't
  // know if the method is meant to be any arbitrary string, or if it should be
  // a union of discrete values (e.g., QUERY | TYPE_A | TYPE_B)
  method: string;
  endpoint: string;
  variable: string;
}>;

const defaultProcedure: Procedure = {
  method: 'QUERY',
  endpoint: '',
  variable: '',
};

const initialProcedures: readonly Procedure[] = [defaultProcedure];

/**
 * @todo 2023-08-31 - Hate that I have to leak out an implementation detail
 * type, but it was the fastest way of making some child components type-safe.
 *
 * This whole set of tRPC components should be redesigned so that the children
 * don't receive a direct dispatch, and don't have to be aware that this
 * component is using useReducer under the hood.
 *
 * Please do not move this to types.ts. Once the tRPC components have been
 * redesigned, this type should stop being exported, so it can go back to just
 * being an implementation detail.
 */
export type ProcedureAction =
  | {
      type: 'procedureUpdated';
      payload: {
        procedureIndex: number;
        key: keyof Procedure;
        newValue: string;
      };
    }
  | { type: 'procedureAdded'; payload: { newProcedure: Procedure } }
  | { type: 'procedureDeleted'; payload: { procedureIndex: number } };

function reduceProcedures(
  procedures: readonly Procedure[],
  action: ProcedureAction
): readonly Procedure[] {
  switch (action.type) {
    case 'procedureUpdated': {
      const { newValue, key, procedureIndex } = action.payload;

      return procedures.map((procedure, i) => {
        if (i !== procedureIndex) return procedure;
        return { ...procedure, [key]: newValue };
      });
    }

    case 'procedureAdded': {
      return [...procedures, action.payload.newProcedure];
    }

    case 'procedureDeleted': {
      const { procedureIndex } = action.payload;
      return procedures.filter((_, i) => i !== procedureIndex);
    }

    default: {
      const invalidAction: never = action;
      throw new Error(
        `Received unknown action ${JSON.stringify(invalidAction)}`
      );
    }
  }
}

export default function TRPCComposer(props: ConnectRouterProps) {
  const reduxDispatch = useAppDispatch();
  const [showSubscription, setShowSubscription] = useState(false);
  const [procedures, proceduresDispatch] = useReducer(
    reduceProcedures,
    initialProcedures
  );

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
    /**
     * @todo Where did they expect the new procedure values to come from?
     */
    proceduresDispatch({ type: 'procedureAdded' });
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
    reduxDispatch(responseDataSaved(reqRes));
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
          proceduresDipatch={proceduresDispatch}
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
              onClose={() => setShowSubscription(false)}
              setWarningMessage={setWarningMessage}
              procedures={procedures}
              proceduresDipatch={proceduresDispatch}
              requestFields={requestFields}
            ></TRPCSubscriptionContainer>
          </div>
        )}
      </div>
    </Box>
  );
}

