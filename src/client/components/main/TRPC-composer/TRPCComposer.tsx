import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
// Import local components
import TRPCMethodAndEndpointEntryForm from './TRPCMethodAndEndpointEntryForm';
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
// Import Actions from RTK slice
import {
  reqResItemAdded,
  responseDataSaved,
} from '../../../toolkit-refactor/slices/reqResSlice';

// Import MUI components
import { Box } from '@mui/material';
import { RootState } from '../../../toolkit-refactor/store';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';
import TRPCProceduresContainer from './TRPCProceduresContainer';

// import tRPC client Module
import {
  createTRPCProxyClient,
  httpBatchLink,
  createWSClient,
  wsLink,
} from '@trpc/client';

import Store from '../../../toolkit-refactor/store';

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
  /** newRequestBody slice from redux store, contains specific request info */
  const requestBody = useSelector(
    (state: RootState) => state.newRequest.newRequestBody
  );

  const [procedures, proceduresDipatch] = useReducer(reducer, [
    PROCEDURE_DEFAULT,
  ]);

  const {
    currentTab,
    newRequestHeadersSet,
    newRequestStreamsSet,
    newRequestFields,
    newRequestHeaders,
    newRequestBody,
    newRequestStreams,
    reqResItemAdded,
  } = props;

  /** newRequestFields slice from redux store, contains general request info*/
  const requestFields = useSelector(
    (state: RootState) => state.newRequestFields
  );

  /** reqRes slice from redux store, contains request and response data */
  const newRequest = useSelector((state: RootState) => state.newRequest);

  let subscription: any;
  const addProcedures = () => {
    proceduresDipatch({ type: 'ADD' });
  };

  function parseString(str) {
    if (str === 'true') {
      return true;
    }

    if (str === 'false') {
      return false;
    }

    if (!isNaN(str)) {
      return parseFloat(str);
    }

    try {
      const parsedJson = JSON.parse(str);

      if (typeof parsedJson === 'object' && parsedJson !== null) {
        return parsedJson;
      }
    } catch (error) {
      return str;
    }
  }

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
  }

  const sendRequest = async () => {
    const links = [];
    const batchConfigureObject = {};
    batchConfigureObject.url = requestFields.url;
    const headers = newRequest.newRequestHeaders.headersArr
      .filter((x) => x.active)
      .reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    if (headers) {
      batchConfigureObject.headers = headers;
    }
    links.push(httpBatchLink(batchConfigureObject));
    
    const client = createTRPCProxyClient({ links });
     
    // processes the request variables, sends the request to the tRPC endpoint, and handles any errors
    Promise.all(
     
      procedures.map((procedure) => {
        let endpoint = procedure.endpoint;
        const method = procedure.method.toLowerCase();
        let tempArg = '';

        if (procedure.variable) {
          let arg = parseString(procedure.variable.replace(/\s/g, ''));
          tempArg = procedure.variable.replace(/\s/g, '');
        }
        const e = `client.${endpoint}.${method}(${tempArg})`;
        
        new Promise((resolve, reject) => {
          try {
            const result = eval(e);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
          .then(res => {
            dispatchTRPCResponse(res);
        })
          .catch(error => {
          dispatchTRPCResponse(error);
          })
      })
    )
  }

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
        <TRPCMethodAndEndpointEntryForm />
        <HeaderEntryForm
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
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
        <SendRequestButton onClick={sendRequest} />
        
      </div>
    </Box>
  );
}

