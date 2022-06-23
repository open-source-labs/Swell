import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { compose } from 'redux';
import { $NotUsed, $TSFixMe } from '../../../types';

export type NewRequestOpenApi = {
  openApiMetadata: {
    info: Record<string, $TSFixMe>;
    tags: $TSFixMe[];
    serverUrls: $TSFixMe[];
  };
  openApiReqArray: $TSFixMe[];
};

const initialState: NewRequestOpenApi = {
  openApiMetadata: {
    info: {},
    tags: [],
    serverUrls: [],
  },
  openApiReqArray: [],
};

/**
 * SET_NEW_REQUESTS_OPENAPI
 * SET_OPENAPI_SERVERS_GLOBAL
 * SET_NEW_OPENAPI_SERVERS
 * SET_NEW_OPENAPI_PARAMETER
 * SET_NEW_OPENAPI_REQUEST_BODY
 */
type Temp1 = { id: $TSFixMe; serverIds: number[] };
type Temp2 = {
  id: $TSFixMe;
  location: 'path' | 'query' | 'header' | 'cookie';
  name: $TSFixMe;
  value: $TSFixMe;
};

export const newRequestOpenApiSlice = createSlice({
  name: 'newRequestOpenApi',
  initialState,
  reducers: {
    // Previously SET_NEW_REQUESTS_OPENAPI
    newRequest(_state: $NotUsed, action: PayloadAction<NewRequestOpenApi>) {
      return action.payload;
    },

    /**
     * Previously SET_OPENAPI_SERVERS_GLOBAL. The old name made it sound like
     * that it was meant to handle new server URLs being added, but the logic
     * only ever removed items.
     */
    serversRemovedByIndex(state, action: PayloadAction<number[]>) {
      const serverIndices = new Set(action.payload);
      const metadata = state.openApiMetadata;

      metadata.serverUrls = metadata.serverUrls.filter((_, index) =>
        serverIndices.has(index)
      );
    },

    /**
     * Previously SET_NEW_OPENAPI_SERVERS
     *
     * This code is really messed up. It looks simple, but it's going to take a
     * while to unravel this, because it's clear that someone lost the thread
     * along the way, and who knows how that affects the components
     */
    newServer(state, action: PayloadAction<Temp1>) {
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
    },

    // Previously SET_NEW_OPENAPI_PARAMETER
    newParameter(state, action: PayloadAction<Temp2>) {
      /**
       * 1. Extract all necessary props from payload (id, loc, name, value)
       * 2. Filter the openapiReqArray to just the objs that meet this criteria
       *    - The request.id prop on the object matches the payload id
       * 3. Grab the last element of the filtered array; call this request
       *    - Current logic does not check whether array is empty and last value
       *      doesn't actually exist/is undefined
       * 4. Map requst.reqServers to a new URL array by:
       *    1. Appending request.endpoint to the end of each URL (not sure if
       *       slashes are accounted for correctly or are necessary)
       * 5. Switch based on the location prop in the payload
       * 6. If the case is path:
       *    1. Map each URL in URL array to have its text replaced. All
       *       instances of "{${payload.name}}" will become payload.value
       *    2. Do absolutely nothing with this mapped array. Obvious bug
       *    3. Set the value of request.urls to be the URLs array
       *    4. Destructure openapiReqArray
       *    5. Push a new object to the array copy with one prop: request, which
       *       will just be the prior value of the request variable
       *    6. Set the value of newRequestsOpenAPI to be the result of the push;
       *       this will always be length of the array post-push. Obvious bug
       *    7. Return a copy of the state, where the newRequestOpenAPI prop gets
       *       its value replaced by the variable version
       * 7. If the case is query:
       *    1.
       * 8. If the case is header:
       * 9. If the case is cookie:
       */
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
    },

    // Previously SET_NEW_OPENAPI_REQUEST_BODY
    newRequestBody(state, action) {
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
    },
  },
});

