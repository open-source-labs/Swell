import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
// Import local components
import TRPCMethodAndEndpointEntryForm from './TRPCMethodAndEndpointEntryForm';
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
// Import Actions from RTK slice

import trpcController from '../../../controllers/trpcController';
import historyController from '../../../controllers/historyController';
import connectionController from '../../../controllers/reqResController';

// Import MUI components
import { Box } from '@mui/material';
import { RootState } from '../../../toolkit-refactor/store';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';
import CookieEntryForm from '../sharedComponents/requestForms/CookieEntryForm';
import TRPCProceduresContainer from './TRPCProceduresContainer';

import Store from '../../../toolkit-refactor/store';
import TRPCSubscriptionContainer from './TRPCSubscriptionContainer';
import { error } from 'console';
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
  } else if (action.type === 'SUBSCRIPTION') {
    return [{ ...PROCEDURE_DEFAULT, method: 'SUBSCRIPTION' }];
  } else if (action.type === 'HTTP') {
    return [{ ...PROCEDURE_DEFAULT }];
  }
  return procedures;
}

export default function TRPCComposer(props) {
  const dispatch = useDispatch();
  // /** newRequestBody slice from redux store, contains specific request info */
  // const requestBody = useSelector(
  //   (state: RootState) => state.newRequest.newRequestBody
  // );

  const [procedures, proceduresDipatch] = useReducer(reducer, [
    PROCEDURE_DEFAULT,
  ]);
  ////////////////////GET STATE@@@@@@@@@@@@@@@@@@@@@@@@@@@@@////////////
  // console.log(Store.getState());
  ////////////////////GET STATE@@@@@@@@@@@@@@@@@@@@@@@@@@@@@////////////
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
      network,
      method,
    },
    newRequestBodySet,
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
    setWorkspaceActiveTab,
  } = props;

  /** newRequestFields slice from redux store, contains general request info*/
  const requestFields = useSelector(
    (state: RootState) => state.newRequestFields
  );

  // console.log(requestFields);
  /** reqRes slice from redux store, contains request and response data */
  const newRequest = useSelector((state: RootState) => state.newRequest);
  // const headers = newRequest.newRequestHeaders.headersArr.filter(
  //   (x) => x.active
  // );

  let subscription: any;
  const addProcedures = () => {
    proceduresDipatch({ type: 'ADD' });
  };
  // const sendRequest = () => {
  //   let isWebsocket = false;
  //   const links = [];
  //   const clientURL: string = requestFields.url; //grabbing url
  //   const request = requestBody.bodyContent;
  //   const httpRegex =
  //     /^http:\/\/([a-zA-Z0-9-]+\.[a-zA-Z]{2,}|localhost)(:[0-9]+)?(\/.*)?$/; // trpc doesn't accept https requests to my knowledge otherwise https?
  //   const wsRegex =
  //     /^(ws|wss):\/\/(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost)(:[0-9]+)?(\/.*)?$/;

  //   //checks if URL is to WebSocket or standard HTTP
  //   if (wsRegex.test(clientURL)) {
  //     // setup links array with ws
  //     isWebsocket = true;

  //     //instantiates a WebSocket
  //     const wsClient = createWSClient({ url: clientURL });
  //     links.push(wsLink({ client: wsClient }));

  //     //grabs the WebSocket from tRPC's wsClient
  //     const ws = wsClient.getConnection();
  //     const persistentData: Array<any> = [];

  //     //current WebSocket is listening for anytime an event is sent back to client
  //     ws.onmessage = (event) => {
  //       persistentData.push(JSON.parse(event.data));
  //       const newCurrentResponse: any = {
  //         checkSelected: false,
  //         checked: false,
  //         connection: 'closed',
  //         connectionType: 'plain',
  //         createdAt: new Date(),
  //         gRPC: false,
  //         graphQL: false,
  //         host: clientURL,
  //         id: uuid(),
  //         minimized: false,
  //         path: '/',
  //         protoPath: undefined,
  //         protocol: 'ws://',
  //         request: { ...requestStuff },
  //         tab: undefined,
  //         timeReceived: 1676146914257,
  //         timeSent: 1676146914244,
  //         url: clientURL,
  //         webrtc: false,
  //         response: {
  //           events: [],
  //         },
  //       };
  //       newCurrentResponse.response.events.push([...persistentData]);
  //       dispatch(responseDataSaved(newCurrentResponse));
  //     };
  //   } else if (httpRegex.test(clientURL)) {
  //     // setup links array with http
  //     links.push(httpBatchLink({ url: clientURL }));
  //   } else {
  //     console.log('error in url');
  //   }

  //   const client = createTRPCProxyClient({ links: links });

  //   //if the request is to a WebSocket server + is a subscription, execute request
  //   if (isWebsocket) {
  //     //replacing user's client name to what app is expecting
  //     const editedRequest = request.replace(/^[^.]*./, 'client.');
  //     subscription = eval(editedRequest);
  //   } else {
  //     //if request is not from Websocket server + is query/mutation, execute request
  //     //this handles batch queries + mutations
  //     const reqArray = request.split('\n').map((el) => {
  //       el = el.replace(/^[^.]*./, 'client.');
  //       return el;
  //     });

  //     Promise.all(reqArray.map((el) => eval(el))).then((res: any) => {
  //       const newCurrentResponse: any = {
  //         checkSelected: false,
  //         checked: false,
  //         connection: 'closed',
  //         connectionType: 'plain',
  //         createdAt: new Date(),
  //         gRPC: false,
  //         graphQL: false,
  //         host: clientURL,
  //         id: uuid(),
  //         minimized: false,
  //         path: '/',
  //         protoPath: undefined,
  //         protocol: 'http://',
  //         request: { ...requestStuff },
  //         tab: undefined,
  //         timeReceived: null,
  //         timeSent: null,
  //         url: clientURL,
  //         webrtc: false,
  //         response: {
  //           events: [res],
  //         },
  //       };

  //       //dispatch response to it's slice, to update the state
  //       dispatch(responseDataSarved(newCurrentResponse));
  //     });
  //   }
  // };

  // function getPath(obj, path, args) {
  //   if (!path) return obj(args);
  //   const properties = path.split('.');
  //   return getPath(obj[properties.shift()], properties.join('.'), args);
  // }

  const sendRequest = async () => {
    const id = uuid();
    // const headers = newRequest.newRequestHeaders.headersArr.filter(
    //   (x) => x.active
    // );
    // const cookie = cookiesArr.filter((x) => x.active);
    // const reqRes = {
    //   id,
    //   createdAt: new Date(),
    //   protocol,
    //   trpc: true,
    //   url: 'http://localhost:3000/trpc',
    //   graphQL,
    //   gRPC,
    //   webrtc,
    //   timeSent: null,
    //   timeReceived: null,
    //   connection: 'uninitialized',
    //   connectionType: null,
    //   checkSelected: false,
    //   host: 'http://localhost:3000',
    //   request: {
    //     method,
    //     headers,
    //     procedures,
    //     bodyType,
    //     rawType,
    //     network,
    //     restUrl,
    //     wsUrl,
    //     gqlUrl,
    //     cookie,
    //   },
    //   response: {
    //     cookies: [],
    //     headers: {},
    //     stream: null,
    //     events: [],
    //   },
    //   checked: false,
    //   minimized: false,
    //   tab: currentTab,
    // };

    const cache = [
      {
        method: 'MUTATE',
        endpoint: 'update',
        variable: '{\n    "userId": "1",\n    "name": "nguyen"\n  }',
      },
      { method: 'QUERY', endpoint: 'sayHi', variable: '' },
      {
        method: 'MUTATE',
        endpoint: 'log',
        variable: '"HELLO WORLD"',
      },
      {
        method: 'QUERY',
        endpoint: 'secretData',
        variable: '{\n    "userId": "1",\n    "name": "justin"\n  }',
      },
      {
        method: 'QUERY',
        endpoint: 'BLAHBLAH.BLAH',
        variable: '{\n    "userId": "1",\n    "name": "justin"\n  }',
      },
    ];

    const cookiCache = [
      { id: 'cookie0', active: true, key: 'cookie1', value: 'cookie1Val' },
      { id: 'cookie1', active: true, key: 'cookie2', value: 'cookie2Val' },
    ];
    const headerCache = [
      { id: 351217.45631817693, active: true, key: 'auth1', value: 'auth2' },
      { id: 87384.65282544694, active: true, key: 'auth3', value: 'auth4' },
    ];
    const reqRes = {
      id,
      createdAt: new Date(),
      protocol,
      trpc: true,
      url: 'http://localhost:3000/trpc',
      graphQL,
      gRPC,
      webrtc,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      host: 'http://localhost:3000',
      request: {
        method,
        headers: headerCache,
        procedures: cache,
        bodyType,
        rawType,
        network,
        restUrl,
        wsUrl,
        gqlUrl,
        cookie: cookiCache,
      },
      response: {
        cookies: [],
        headers: [],
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
    trpcController.sendRequest(reqRes);

    // const links = [];
    // const batchConfigureObject = {};
    // batchConfigureObject.url = requestFields.url;

    // if (headers) {
    //   batchConfigureObject.headers = headers;
    // }
    // links.push(httpBatchLink(batchConfigureObject));
    // // const clientURL: string = requestFields.url; //grabbing url
    // const client = createTRPCProxyClient({ links });
    // const newCurrentResponse: any = {
    //   checkSelected: false,
    //   checked: false,
    //   connection: 'closed',
    //   connectionType: 'plain',
    //   createdAt: new Date(),
    //   gRPC: false,
    //   graphQL: false,
    //   host: requestFields.url,
    //   id: uuid(),
    //   minimized: false,
    //   path: '/',
    //   protoPath: undefined,
    //   protocol: 'http://',
    //   request: { ...newRequest },
    //   tab: undefined,
    //   timeReceived: null,
    //   timeSent: null,
    //   url: requestFields.url,
    //   webrtc: false,
    //   response: {
    //     events: [],
    //   },
    // };
    // console.log(procedures);
    // Promise.all(
    //   procedures.map((procedure) => {
    //     const endpoint = procedure.endpoint;
    //     const method = procedure.method.toLowerCase();
    //     const endpointAndMethod = `${endpoint}.${method}`;
    //     if (procedure.variable) {
    //       let arg = parseString(procedure.variable);

    //       return getPath(client, endpointAndMethod, arg);
    //     } else {
    //       return getPath(client, endpointAndMethod);
    //     }
    //   })
    // )
    //   .then((res) => {
    //     // const fakeRes = {
    //     //   id: uuid(),
    //     //   createdAt: new Date(),
    //     //   protocol: 'http://',
    //     //   url: 'google.com',
    //     //   timeSent: null,
    //     //   timeReceived: null,
    //     //   connection: 'uninitialized',
    //     //   connectionType: null,
    //     //   checkSelected: false,
    //     //   request: {
    //     //     method: 'Get',
    //     //   },
    //     //   response: {
    //     //     headers: {},
    //     //     events: [res],
    //     //   },
    //     //   checked: false,
    //     //   minimized: false,
    //     //   tab: currentTab,
    //     // };
    //     newCurrentResponse.response.events.push(res);
    //     //dispatch response to it's slice, to update the state
    //     // reqResItemAdded(newCurrentResponse);
    //     dispatch(responseDataSaved(newCurrentResponse));
    //   })
    //   .catch((e) => {
    //     newCurrentResponse.response.events.push(e);
    //     dispatch(responseDataSaved(newCurrentResponse));
    //   });
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
        <TRPCMethodAndEndpointEntryForm proceduresDipatch={proceduresDipatch} />

        {requestFields.protocol === 'ws://' ? (
          <div>
            <TRPCSubscriptionContainer
              procedures={procedures}
              proceduresDipatch={proceduresDipatch}
              requestFields={requestFields}
            ></TRPCSubscriptionContainer>
          </div>
        ) : (
          <div>
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
            <SendRequestButton onClick={sendRequest} />
            {/* {requestFields.method === 'SUBSCRIPTION' && ( ////for subscription
          <SendRequestButton
            onClick={() => subscription.unsubscribe()}
            buttonText="Close Subscription"
          ></SendRequestButton>
        )} */}
          </div>
        )}
      </div>
    </Box>
  );
}

