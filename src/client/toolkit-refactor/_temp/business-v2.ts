import { format, parseISO } from 'date-fns';
import historyReducer from '../history/old-history';
import * as actionTypes from '../../actions(deprecated)/actionTypes';

import { $TSFixMe } from '../../../types';

/**
 * This section defines the interfaces for the Redux store state. Only the
 * StateInterface at the end is directly exported; it's basically a combo of
 * the others.
 *
 * Note: A number of these arrays were typed as just []. Never, EVER do this.
 * This implicitly turns them into any[]. If you ever turn on the
 * noImplicityAny setting, TypeScript won't be able to use that implicit any[]
 * anymore, and will have no choice but to turn the arrays into never[]. never
 * arrays, by definition, can't hold ANY values, making them useless. Ideally
 * you should be using much more precise type information, but at the very
 * least, make them explicit any values by setting them to any[].
 *
 * Also, you'll often hear that you shouldn't use the "any" type at all, and
 * that there's an "unknown" type which is basically a safer version of it. That
 * does NOT mean that they're interchangeable. The any type can represent all
 * types, but does so with zero type checking – that's basically just vanilla
 * JavaScript. The unknown type represents all types, but you have to do a lot
 * of work to prove to TypeScript that it's actually in the form you want it to
 * be. You can't just swap out all anys for unknowns without changing how you
 * access the values. It's not type-safe, and TypeScript will (rightfully) yell
 * at you.
 *
 * @todo Replace all instances of the $TSFixMe types and Record<string, unknown>
 * with more precise type info.
 *
 * @todo Maybe move this to central types file? Only do this if other files
 * actually need to import the type information directly, and not just a value
 * or function from here that just happens to use the type info.
 */

/**
 * Defines the fields needed for a new request. This SEEMS to be a general-
 * purpose request that can work with all protocols?
 */
interface NewRequestFields {
  protocol: string;
  restUrl: string;
  wsUrl: string;
  gqlUrl: string;
  grpcUrl: string;
  webrtcUrl: string;
  url: string;
  method: string;
  graphQL: boolean;
  gRPC: boolean;
  ws: boolean;
  openapi: boolean;
  webrtc: boolean;
  webhook: boolean;
  network: string;
  testContent: string;
  testResults: $TSFixMe[];
  openapiReqObj: Record<string, unknown>;
}

interface NewRequestOpenAPI {
  openapiReqArray: $TSFixMe[];
  openapiMetadata: {
    info: Record<string, unknown>;
    tags: $TSFixMe[];
    serverUrls: $TSFixMe[];
  };
}

interface NewRequestStreams {
  // A lot of these values are typed to only ever be null, which doesn't seem
  // too useful? Was this a mistake?
  streamsArr: $TSFixMe[];
  count: number;
  streamContent: any[];
  selectedPackage: null;
  selectedRequest: null;
  selectedService: null;
  selectedServiceObj: null;
  selectedStreamingType: null;
  initialQuery: null;
  queryArr: null;
  protoPath: null;
  services: null;
  protoContent: string;
}

interface NewRequestOpenAPIObject {
  request: {
    id: number;
    enabled: boolean;
    reqTags: $TSFixMe[];
    reqServers: $TSFixMe[];
    summary: string;
    description: string;
    operationId: string;
    method: string;
    endpoint: string;
    headers: Record<string, unknown>;
    parameters: any[];
    body: Record<string, unknown>;
    urls: $TSFixMe[];
  };
}

interface NewRequestBody {
  bodyContent: string;
  bodyVariables: string;
  bodyType: string;
  rawType: string;
  JSONFormatted: boolean;
  bodyIsNew: boolean;
}

/**
 * Defines the top-level state for the business logic in the Redux store. This
 * does NOT deal with UI and animations.
 */
export interface StateInterface {
  currentTab: string;
  reqResArray: $TSFixMe[];
  scheduledReqResArray: $TSFixMe[];
  collections: $TSFixMe[];
  warningMessage: Record<string, unknown>;
  dataPoints: Record<string, unknown>;

  // This type definition might not be right, but it matches how the value was
  // being used beforehand
  history: {
    date: string;
    history: $TSFixMe[];

    /**
     * Should probably be a number or string (one or the other, not union)
     */
    id: $TSFixMe;
    createdAt: $TSFixMe;
  }[];

  newRequestHeaders: {
    headersArr: $TSFixMe[];
    count: number;
  };

  newRequestCookies: {
    cookiesArr: $TSFixMe[];
    count: number;
  };

  newRequestBody: NewRequestBody;

  newRequestSSE: {
    isSSE: boolean;
  };

  introspectionData: {
    schemaSDL: null;
    clientSchema: null;
  };

  currentResponse: {
    request: {
      network: string;
    };
  };

  newRequestsOpenAPI: NewRequestOpenAPI;
  newRequestFields: NewRequestFields;
  newRequestStreams: NewRequestStreams;
  newRequestOpenAPIObject: NewRequestOpenAPIObject;
}

/**
 * Defines the initial state for the primary reducer function
 */
export const initialState: StateInterface = {
  currentTab: 'First Tab',
  reqResArray: [],
  scheduledReqResArray: [],
  history: [],
  collections: [],
  warningMessage: {},
  newRequestsOpenAPI: {
    openapiMetadata: {
      info: {},
      tags: [],
      serverUrls: [],
    },
    openapiReqArray: [],
  },

  newRequestFields: {
    protocol: '',
    restUrl: 'http://',
    wsUrl: 'ws://',
    gqlUrl: 'https://',
    grpcUrl: '',
    webrtcUrl: '',
    url: 'http://',
    method: 'GET',
    graphQL: false,
    gRPC: false,
    ws: false,
    openapi: false,
    webrtc: false,
    webhook: false,
    network: 'rest',
    testContent: '',
    testResults: [],
    openapiReqObj: {},
  },

  newRequestHeaders: {
    headersArr: [],
    count: 0,
  },

  newRequestStreams: {
    streamsArr: [],
    count: 0,
    streamContent: [],
    selectedPackage: null,
    selectedRequest: null,
    selectedService: null,
    selectedServiceObj: null,
    selectedStreamingType: null,
    initialQuery: null,
    queryArr: null,
    protoPath: null,
    services: null,
    protoContent: '',
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

  newRequestOpenAPIObject: {
    request: {
      id: 0,
      enabled: true,
      reqTags: [],
      reqServers: [],
      summary: '',
      description: '',
      operationId: '',
      method: '',
      endpoint: '',
      headers: {},
      parameters: [],
      body: {},
      urls: [],
    },
  },

  introspectionData: {
    schemaSDL: null,
    clientSchema: null,
  },

  dataPoints: {},

  currentResponse: {
    request: {
      network: '',
    },
  },
};

type CollectionsActions =
  | { type: typeof actionTypes.COLLECTION_ADD }
  | { type: typeof actionTypes.GET_COLLECTIONS }
  | { type: typeof actionTypes.DELETE_COLLECTION }
  | { type: typeof actionTypes.COLLECTION_UPDATE };

function collectionsReducer(
  collections: StateInterface['collections'],
  action: CollectionsActions
): StateInterface['collections'] {
  switch (action.type) {
    case actionTypes.GET_COLLECTIONS: {
      return action.payload;
    }

    case actionTypes.DELETE_COLLECTION: {
      const deleteId = action.payload.id;
      return collections.filter((element) => element !== deleteId);
    }

    case actionTypes.COLLECTION_ADD: {
      return [action.payload, ...collections];
    }

    case actionTypes.COLLECTION_UPDATE: {
      // update collection from state
      const collectionName = action.payload.name;
      const newCollections: string[] = JSON.parse(JSON.stringify(collections));

      newCollections.forEach((obj: $TSFixMe, i) => {
        if (obj.name === collectionName) {
          newCollections[i] = action.payload;
        }
      });

      return newCollections;
    }

    default: {
      return collections;
    }
  }
}

const businessReducer = (
  state = initialState,
  action: { type: string; payload: unknown }
): StateInterface => {
  switch (action.type) {
    // copied over to historyReducer
    // case actionTypes.GET_HISTORY: {
    //   return {
    //     ...state,
    //     history: action.payload,
    //   };
    // }

    //copied over to historyReducer
    // case actionTypes.DELETE_HISTORY: {
    //   const deleteId: number = action.payload.id;
    //   let createdAt;
    //   if (typeof action.payload.createdAt === 'string') {
    //     createdAt = parseISO(action.payload.createdAt);
    //   } else {
    //     createdAt = action.payload.createdAt;
    //   }

    //   const deleteDate: string = format(createdAt, 'MM/dd/yyyy');
    //   const newHistory = JSON.parse(JSON.stringify(state.history));

    //   newHistory.forEach((obj: $TSFixMe, i: number) => {
    //     if (obj.date === deleteDate) {
    //       obj.history = obj.history.filter((hist) => hist.id !== deleteId);
    //     }

    //     if (obj.history.length === 0) {
    //       newHistory.splice(i, 1);
    //     }
    //   });
    //   console.log('newHistory', newHistory);
    //   return {
    //     ...state,
    //     history: newHistory,
    //   };
    // }

    // Copied over to historyReducer
    // case actionTypes.CLEAR_HISTORY: {
    //   return {
    //     ...state,
    //     history: [],
    //   };
    // }

    //copied over to collectionsReducer
    // case actionTypes.GET_COLLECTIONS: {
    //   return {
    //     ...state,
    //     collections: action.payload,
    //   };
    // }

    //copied over to collectionsReducer
    // case actionTypes.DELETE_COLLECTION: {
    //   const deleteId: Record<string, unknown> = action.payload.id;
    //   const newCollections: string[] = JSON.parse(
    //     JSON.stringify(state.collections)
    //   );
    //   // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
    //   newCollections.forEach((obj: Record<string, unknown>, i: $TSFixMe) => {
    //     if (obj.id === deleteId) {
    //       newCollections.splice(i, 1);
    //     }
    //   });
    //   return {
    //     ...state,
    //     collections: newCollections,
    //   };
    // }

    case actionTypes.RESET_COMPOSER_FIELDS: {
      return {
        ...state,
        newRequestHeaders: {
          headersArr: [],
          count: 0,
        },
        newRequestCookies: {
          cookiesArr: [],
          count: 0,
        },
        newRequestBody: {
          ...state.newRequestBody,
          bodyContent: '',
          bodyVariables: '',
          bodyType: 'raw',
          rawType: 'text/plain',
          JSONFormatted: true,
        },
        newRequestFields: {
          // should this clear every field or just protocol?
          ...state.newRequestFields,
          protocol: '',
        },
        newRequestSSE: {
          isSSE: false,
        },
        warningMessage: {},
      };
    }

    case actionTypes.COLLECTION_TO_REQRES: {
      const reqResArray = JSON.parse(JSON.stringify(action.payload));
      return {
        ...state,
        reqResArray,
      };
    }

    // //copied over to collectionsReducer
    // case actionTypes.COLLECTION_ADD: {
    //   // add to collection to array in state
    //   return {
    //     ...state,
    //     collections: [action.payload, ...state.collections],
    //   };
    // }

    // //copied over to collectionsReducer
    // case actionTypes.COLLECTION_UPDATE: {
    //   // update collection from state
    //   const collectionName = action.payload.name;
    //   const newCollections: string[] = JSON.parse(
    //     JSON.stringify(state.collections)
    //   );
    //   // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
    //   newCollections.forEach((obj: $TSFixMe, i: $TSFixMe) => {
    //     if (obj.name === collectionName) {
    //       newCollections[i] = action.payload;
    //     }
    //   });

    //   return {
    //     ...state,
    //     collections: newCollections,
    //   };
    // }

    case actionTypes.REQRES_CLEAR: {
      return {
        ...state,
        reqResArray: [],
        currentResponse: {
          request: {
            network: '',
          },
        },
      };
    }

    case actionTypes.REQRES_ADD: {
      const reqResArray = JSON.parse(JSON.stringify(state.reqResArray));
      reqResArray.push(action.payload);
      const addDate = format(action.payload.createdAt, 'MM/dd/yyyy');
      const newHistory: string[] = JSON.parse(JSON.stringify(state.history));
      let updated = false;
      // if there is history for added date, add query to beginning of history
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
      newHistory.forEach((obj: $TSFixMe) => {
        if (obj.date === addDate) {
          obj.history.unshift(action.payload);
          updated = true;
        }
      });
      // if there is not history at added date, create new history with new query
      if (!updated) {
        newHistory.unshift({
          date: addDate,
          history: [action.payload],
        });
      }

      return {
        ...state,
        reqResArray,
        history: newHistory,
      };
    }

    case actionTypes.REQRES_DELETE: {
      const deleteId = action.payload.id;
      const newReqResArray = state.reqResArray.filter(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'never'.
        (reqRes) => reqRes.id !== deleteId
      );
      return {
        ...state,
        reqResArray: newReqResArray,
      };
    }

    case actionTypes.SET_CHECKS_AND_MINIS: {
      return {
        ...state,
        reqResArray: JSON.parse(JSON.stringify(action.payload)),
      };
    }

    case actionTypes.REQRES_UPDATE: {
      const reqResDeepCopy = JSON.parse(JSON.stringify(state.reqResArray));
      let indexToBeUpdated;
      reqResDeepCopy.forEach((reqRes: $TSFixMe, index: $TSFixMe) => {
        if (reqRes.id === action.payload.id) indexToBeUpdated = index;
      });
      if (indexToBeUpdated !== undefined) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'checked' does not exist on type 'never'.
        action.payload.checked = state.reqResArray[indexToBeUpdated].checked;
        action.payload.minimized =
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'minimized' does not exist on type 'never... Remove this comment to see the full error message
          state.reqResArray[indexToBeUpdated].minimized;
        reqResDeepCopy.splice(
          indexToBeUpdated,
          1,
          JSON.parse(JSON.stringify(action.payload))
        ); // FOR SOME REASON THIS IS NECESSARY, MESSES UP CHECKS OTHERWISE
      }

      return {
        ...state,
        reqResArray: reqResDeepCopy,
      };
    }

    case actionTypes.SCHEDULED_REQRES_UPDATE: {
      const scheduledReqResArray = JSON.parse(
        JSON.stringify(state.scheduledReqResArray)
      );
      scheduledReqResArray.push(action.payload);
      return {
        ...state,
        scheduledReqResArray,
      };
    }

    case actionTypes.SCHEDULED_REQRES_DELETE: {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
      const scheduledReqResArray: $TSFixMe = [];
      return {
        ...state,
        scheduledReqResArray,
      };
    }

    case actionTypes.UPDATE_GRAPH: {
      const { id } = action.payload;
      // action.payload is the latest reqRes object

      // dataPoints to be used by graph
      const dataPointsCopy = JSON.parse(JSON.stringify(state.dataPoints));
      dataPointsCopy.current = id;
      // if more than 8 points, data will shift down an index
      if (!dataPointsCopy[id]) {
        dataPointsCopy[id] = [];
      } else if (dataPointsCopy[id].length > 49) {
        dataPointsCopy[id] = dataPointsCopy[id].slice(1);
      }

      // check if new object is a closed request with timeSent and timeReceived
      if (
        !dataPointsCopy[id].some(
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
          (elem: $TSFixMe) => elem.timeSent === action.payload.timeSent
        )
      ) {
        // if a color hasn't been added to this specific request id, add a new one
        const color = !dataPointsCopy[id][0]?.color
          ? `${Math.random() * 256}, ${Math.random() * 256}, ${
              Math.random() * 256
            }`
          : dataPointsCopy[id][0].color;

        // add dataPoint to array connected to its id -and return to state
        dataPointsCopy[id].push({
          reqRes: action.payload,
          url: action.payload.url,
          timeSent: action.payload.timeSent,
          timeReceived: action.payload.timeReceived,
          createdAt: action.payload.createdAt,
          color,
        });
        return {
          ...state,
          dataPoints: dataPointsCopy,
        };
      }
      return {
        ...state,
        dataPoints: dataPointsCopy,
      };
    }

    case actionTypes.CLEAR_GRAPH: {
      const dataPointsCopy = JSON.parse(JSON.stringify(state.dataPoints));
      dataPointsCopy[action.payload] = [];
      return {
        ...state,
        dataPoints: dataPointsCopy,
      };
    }

    case actionTypes.CLEAR_ALL_GRAPH: {
      return {
        ...state,
        dataPoints: {},
      };
    }

    case actionTypes.SET_COMPOSER_WARNING_MESSAGE: {
      return {
        ...state,
        warningMessage: action.payload,
      };
    }

    case actionTypes.SET_NEW_REQUEST_FIELDS: {
      return {
        ...state,
        newRequestFields: action.payload,
      };
    }

    case actionTypes.SET_NEW_REQUEST_HEADERS: {
      return {
        ...state,
        newRequestHeaders: action.payload,
      };
    }

    case actionTypes.SET_NEW_REQUEST_STREAMS: {
      return {
        ...state,
        newRequestStreams: action.payload,
      };
    }

    case actionTypes.SET_NEW_REQUEST_BODY: {
      return {
        ...state,
        newRequestBody: action.payload,
      };
    }

    case actionTypes.SET_NEW_TEST_CONTENT: {
      return {
        ...state,
        newRequestFields: {
          ...state.newRequestFields,
          testContent: action.payload,
        },
      };
    }

    case actionTypes.SET_NEW_REQUEST_COOKIES: {
      return {
        ...state,
        newRequestCookies: action.payload,
      };
    }

    case actionTypes.SET_NEW_REQUEST_SSE: {
      return {
        ...state,
        newRequestSSE: { isSSE: action.payload },
      };
    }

    case actionTypes.SET_CURRENT_TAB: {
      return {
        ...state,
        currentTab: action.payload,
      };
    }

    case actionTypes.SET_INTROSPECTION_DATA: {
      return {
        ...state,
        introspectionData: action.payload,
      };
    }

    case actionTypes.SAVE_CURRENT_RESPONSE_DATA: {
      return {
        ...state,
        currentResponse: action.payload,
      };
    }

    // OPENAPI

    case actionTypes.SET_NEW_REQUESTS_OPENAPI: {
      return {
        ...state,
        newRequestsOpenAPI: { ...action.payload },
      };
    }

    case actionTypes.SET_OPENAPI_SERVERS_GLOBAL: {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiMetadata' does not exist on type ... Remove this comment to see the full error message
      const openapiMetadata = { ...state.openapiMetadata };
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiMetadata' does not exist on type ... Remove this comment to see the full error message
      openapiMetadata.serverUrls = [...state.openapiMetadata.serverUrls].filter(
        (_, i) => action.payload.includes(i)
      );
      return {
        ...state,
        newRequestsOpenAPI: openapiMetadata,
      };
    }

    case actionTypes.SET_NEW_OPENAPI_SERVERS: {
      const { id, serverIds } = action.payload;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
      const request = [...state.openapiReqArray]
        .filter(({ request }) => request.id === id)
        .pop();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiMetadata' does not exist on type ... Remove this comment to see the full error message
      request.reqServers = [...state.openapiMetadata.serverUrls].filter(
        (_, i) => serverIds.includes(i)
      );
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
      const openapiReqArray = [...state.openapiReqArray].push({ request });
      return {
        ...state,
        newRequestsOpenAPI: openapiReqArray,
      };
    }

    case actionTypes.SET_NEW_OPENAPI_PARAMETER: {
      const { id, location, name, value } = action.payload;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
      const request = [...state.openapiReqArray]
        .filter(({ request }) => request.id === id)
        .pop();
      const urls = [...request.reqServers].map(
        (url) => (url += request.endpoint)
      );
      switch (location) {
        case 'path': {
          urls.map((url) => url.replace(`{${name}}`, value));
          request.urls = urls;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
          const openapiReqArray = [...state.openapiReqArray].push({ request });
          return {
            ...state,
            newRequestsOpenAPI: openapiReqArray,
          };
        }
        case 'query': {
          urls.map((url) => {
            if (url.slice(-1) !== '?') url += '?';
            url += `${name}=${value}&`;
          });
          request.urls = urls;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
          const openapiReqArray = [...state.openapiReqArray].push({ request });
          return {
            ...state,
            newRequestsOpenAPI: openapiReqArray,
          };
        }
        case 'header': {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'key'.
          if (['Content-Type', 'Authorization', 'Accepts'].includes(key)) break;
          request.headers.push({ name: value });
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
          const openapiReqArray = [...state.openapiReqArray].push({ request });
          return {
            ...state,
            newRequestsOpenAPI: openapiReqArray,
          };
        }
        case 'cookie': {
          request.cookies = value;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
          const openapiReqArray: [Record<string, unknown>] = [
            ...state.openapiReqArray,
          ].push({ request });
          return {
            ...state,
            newRequestsOpenAPI: openapiReqArray,
          };
        }
        default: {
          return state;
        }
      }
      break;
    }
    case actionTypes.SET_NEW_OPENAPI_REQUEST_BODY: {
      const { id, mediaType, requestBody } = action.payload;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
      const request: Record<string, unknown> = [...state.openapiReqArray]
        .filter(({ request }) => request.id === id)
        .pop();
      const { method } = request;
      if (
        !['get', 'delete', 'head'].includes(method) &&
        requestBody !== undefined
      ) {
        request.body = requestBody;
        request.rawType = mediaType;
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
      const openapiReqArray = [...state.openapiReqArray].push({ request });
      return {
        ...state,
        newRequestsOpenAPI: openapiReqArray,
      };
    }
    default:
      return state;
  }
  return state;
};

export default businessReducer;

