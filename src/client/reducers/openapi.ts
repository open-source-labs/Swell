import * as interfaces from '../../types'
import * as types from '../actions/actionTypes';
import { action } from '../actions/actionsOAI';
import parseOpenapiDocument from '../controllers/openapiController';

const initialState: interfaces.initialState = {
  // ...state,
  currentTab: 'First Tab',
  reqResArray: [],
  scheduledReqResArray: [],
  history: [],
  collections: [],
  openapiMetadata: {
    info: {},
    tags: [],
    serverUrls: [],
  },
  openapiReqArray: [],
  warningMessage: {},
  newRequestFields: {
    protocol: 'openAPI',
    graphQL: false,
    gRPC: false,
    ws: false,
    webrtc: false,
    url: 'http://',
    method: 'GET',
    network: 'rest',
    testContent: '',
    testResults: [],
  },
  newRequestHeaders: {
    headersArr: [],
    count: 0,
  },
  newRequestCookies: {
    cookiesArr: [],
    count: 0,
  },
  newRequestBody: {
    bodyContent: '',
    bodyVariables: '',
    bodyType: 'raw',
    rawType: 'text/plain',
    JSONFormatted: true,
    bodyIsNew: false,
  },
  newRequestSSE: {
    isSSE: false,
  },
};

// {
//   'id': 13,
//   enabled: true, // user toggles state
//   tags: ["Users"],
//   method: "post",
//   headers: [],
//   urls: ['http://api.twitter.com/2/users/13/blocking',
//   'http://api.twitter.com/2/users/240/blocking',
//   'http://api.twitter.com/2/users/24/blocking?required=false&TZ=utc%159'],
//   body: userInput.body// JSON, user text input
//   ,summary, description, operationId,
// }


// var info, tags, reqTags, reqResArray, reqResObj, urls, method, headers, body,
const openapiReducer = (state = initialState, action) => {
// var info, tags, reqTags, reqResArray, reqResObj, urls, method, headers, body, 
const openapiReducer = (state = initialState, action: action): Record<string, unknown> => {

  switch (action.type) {
    case types.IMPORT_OAI_DOCUMENT: {
      const { info, tags, serverUrls, reqResArray } = parseOpenapiDocument(
        action.payload
      );
      return {
        ...state,
        metadataOAI: { info, tags, serverUrls },
        openapiMetadata: {info, tags, serverUrls},

        reqResArray,
      };
    }
    case types.SET_OAI_SERVERS_GLOBAL: {

      const metadataOAI = { ...state.metadataOAI };
      metadataOAI.serverUrls = [...state.metadataOAI.serverUrls].filter(
        (_, i) => action.payload.includes(i)
      );

      const openapiMetadata = { ...state.openapiMetadata };
      openapiMetadata.serverUrls = [ ...state.openapiMetadata.serverUrls as string[] ].filter((_, i) => action.payload.includes(i));

      return {
        ...state,
        openapiMetadata,
      };
    }
    case types.SET_OAI_SERVERS: {
      const { id, serverIds } = action.payload;

      const request = [...state.reqResArray]
        .filter(({ request }) => request.id === id)
        .pop() as Record<string, unknown>;
      request.reqServers = [...state.metadataOAI.serverUrls].filter((_, i) =>
        serverIds.includes(i)
      );
      const reqResArray = [...state.reqResArray].push({ request });

      return {
        ...state,
        reqResArray,
      };
    }
    case types.SET_NEW_OAI_PARAMETER: {
      const { id, type, key, value } = action.payload;

      const request = [...state.reqResArray]
        .filter(({ request }) => request.id === id)
        .pop() as Record<string, unknown>;
      const urls = [...(request.reqServers as string[])].map(
        (url) => (url += request.endpoint)
      );

        case 'path': {
          urls.map((url) => url.replace(`{${key}}`, value));
          request.urls = urls;
          const reqResArray = [...state.reqResArray].push({ request });
          return {
            ...state,
            reqResArray,
          };
        }
        case 'query': {
          urls.map((url) => {
            if (url.slice(-1) !== '?') url += '?';
            url += `${key}=${value}&`;
          });
          request.urls = urls;
          const reqResArray = [...state.reqResArray].push({ request });
          return {
            ...state,
            reqResArray,
          };
        }

        default: {
          return state;

        // case 'header': {
        //   if (['Content-Type', 'Authorization', 'Accepts'].includes(param.name)) break;
        //   const headers = userInput.parameters[id].filter(({ type }) => type === 'header');
        //   request.headers = {};
        //   headers.forEach((header) => )
        // }
        // case 'cookie': {
          
        // }
        default: {
          return { ...state };

        }
      }
    }
    case types.SET_NEW_OAI_REQUEST_BODY: {
      const { id, mediaType, requestBody } = action.payload;

      const request = [...state.reqResArray]
        .filter(({ request }) => request.id === id)
        .pop() as Record<string, unknown>;

      const request = [ ...state.reqResArray ].filter(({ request }) => request.id === id).pop();
      const { method } = request as Record<string, string>;
      if (
        !['get', 'delete', 'head'].includes(method) &&
        requestBody !== undefined
      ) {
        const body = new Map(mediaType);
        body.set(mediaType, requestBody) as Map<string, unknown>;
        request.body = body;
      }
      const reqResArray = [...state.reqResArray].push({ request });
      return {
        ...state,
        reqResArray,
      };
    }
    case types.SEND_OAI_REQUESTS: {
      const reqResArray = [...state.reqResArray].filter(
        ({ request }) => request.enabled
      );
      return {};
    }
    default: {
      return state;
    }

    default: {
      return { ...state };
    }
  }
};

export default openapiReducer;
