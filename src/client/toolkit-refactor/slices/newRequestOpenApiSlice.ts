/**
 * @file Defines the slice for managing all state related to the Open API
 * protocol.
 *
 * Remember: this is Redux Toolkit. Returning undefined is valid, because
 * Toolkit runs some processes after the reducer runs to merge the Immer object
 * into the previous state.
 */

import { assertTypeExhaustion } from '../../../helpers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { compose } from 'redux';
import { $NotUsed, $TSFixMe } from '../../../types';

/**
 * Describes a single element within the NewRequestOpenApi type's array of
 * requests.
 */
export type OpenApiRequest = {
  request: {
    id: number;
  };

  // No idea why headers is an array of single-property objects, instead of just
  // strings;
  headers: { name: string }[];

  urls: string[];
  endpoint: string;
  reqServers: string[];
  serverIds: number[];
  cookies: string;
  method: string;

  // Below types should probably be strings, but who knows, really? Types united
  // with $TSFixMe to "temporarily" turn off type-checking (with how this
  // project tends to go, these types might be stuck like this for months/years)
  body: string | $TSFixMe;
  mediaType: string | $TSFixMe;
  rawType: string | $TSFixMe;
};

/**
 * Describes an object for keeping track of all OpenAPI request information.
 */
export type NewRequestOpenApi = {
  openApiMetadata: {
    info: Record<string, $TSFixMe>;
    tags: $TSFixMe[];
    serverUrls: $TSFixMe[];
  };

  openApiReqArray: OpenApiRequest[];
};

/**
 * An object with info about how a request should be updated? Maybe?
 *
 * There were a lot of typos in the reducer logic for this file, and the
 * function was never added to any of the code, so there's no way to tell from
 * context alone.
 */
type RequestUpdateInfo = {
  id: number;
  location: 'path' | 'query' | 'header' | 'cookie';
  name: string;
  value: $TSFixMe;
};

/**
 * Defines a custom type for media/request information? Maybe?
 *
 * There were a lot of typos in the reducer logic for this file, and the
 * function was never added to any of the code, so there's no way to tell from
 * context alone.
 */
type MediaInfo = {
  requestId: number;
  mediaType: string;
  requestBody: $TSFixMe;
};

const initialState: NewRequestOpenApi = {
  openApiMetadata: {
    info: {},
    tags: [],
    serverUrls: [],
  },
  openApiReqArray: [],
};

const newRequestOpenApiSlice = createSlice({
  name: 'newRequestOpenApi',
  initialState,
  reducers: {
    //Before toolkit conversion was SET_NEW_REQUESTS_OPENAPI or setNewRequestsOpenAPI
    openApiRequestsReplaced(
      _state: $NotUsed,
      action: PayloadAction<NewRequestOpenApi>
    ) {
      console.log('OpenAPI slice Request Replaced',_state, action)
      return action.payload;
    },

    /**
     * Before toolkit conversion was SET_OPENAPI_SERVERS_GLOBAL or setOpenAPIServersGlobal.
     * The old name made it sound like that it was meant to handle new server
     * URLs being added, but the logic only ever removed items.
     */
    serversRemovedByIndex(state, action: PayloadAction<number[]>) {
      const serverIndices = new Set(action.payload);
      const metadata = state.openApiMetadata;

      metadata.serverUrls = metadata.serverUrls.filter((_, index) =>
        serverIndices.has(index)
      );
    },

    /**
     * Before toolkit conversion was SET_NEW_OPENAPI_SERVERS or setOpenAPIServers
     */
    newServerAdded(state, action: PayloadAction<OpenApiRequest>) {
      const { id } = action.payload.request;
      const filteredById = state.openApiReqArray.filter(
        (reqObj) => reqObj.request.id === id
      );

      // Previous logic only ever looked for the most recent element; not sure
      // why, though – is there any special meaning, or was this just a clumsy
      // attempt at saving keystrokes?
      const reqToBeUpdated = filteredById.pop();
      if (!reqToBeUpdated) {
        return;
      }

      const serverIds = new Set(action.payload.serverIds);
      reqToBeUpdated.reqServers = state.openApiMetadata.serverUrls.filter(
        (_, i) => serverIds.has(i)
      );

      state.openApiReqArray.push(reqToBeUpdated);
    },

    // Before toolkit conversion was SET_NEW_OPENAPI_PARAMETER or setOpenAPIParameter
    newParameterAdded(state, action: PayloadAction<RequestUpdateInfo>) {
      const { id, location, name, value } = action.payload;
      const filteredById = state.openApiReqArray.filter(
        (entry) => entry.request.id === id
      );


      const latestRequest = filteredById.pop();
      if (!latestRequest) {
        return;
      }

      const appendEndpoint = (url: string) => `${url}${latestRequest.endpoint}`;

      switch (location) {
        case 'path': {
          // First arg of replace call was `{${name}}`, but { and } are not
          // valid HTTP characters. Changed arg to just name, but not fully
          // sure what happens when you try to use a URL with invalid
          // characters
          const updateKeyValues = compose(
            (url) => url.replace(name, value),
            appendEndpoint
          );

          latestRequest.urls = latestRequest.reqServers.map(updateKeyValues);
          state.openApiReqArray.push(latestRequest);
          return;
        }

        case 'query': {
          const appendKeyValues = compose((url) => {
            const queryBoundary = url.at(-1) === '?' ? '' : '?';
            return `${url}${queryBoundary}${name}=${value}&`;
          }, appendEndpoint);

          latestRequest.urls = latestRequest.reqServers.map(appendKeyValues);
          state.openApiReqArray.push(latestRequest);
          return;
        }

        case 'header': {
          // Actions that require no action from the reducer
          const nonActionHeaders = ['Content-Type', 'Authorization', 'Accepts'];

          // Logic previously checked for variable called key; it did not exist
          // in the previous implementation. Assuming this is supposed to be the
          // "name" prop from the payload, but not sure
          if (nonActionHeaders.includes(name)) {
            return;
          }

          // No idea why this is an array, where each element is a single key-
          // value pair, instead of an object that has them all grouped together
          // under one value
          latestRequest.headers.push({ name: value });
          state.openApiReqArray.push(latestRequest);
          return;
        }

        case 'cookie': {
          latestRequest.cookies = value;
          state.openApiReqArray.push(latestRequest);
          return;
        }

        default: {
          assertTypeExhaustion(location);
        }
      }
    },

    // Before toolkit conversion was SET_NEW_OPENAPI_REQUEST_BODY or setOpenAPIRequestBody
    requestBodyUpdated(state, action: PayloadAction<MediaInfo>) {
      const { requestId, mediaType, requestBody } = action.payload;
      const filteredById = state.openApiReqArray.filter(
        (reqResObj) => reqResObj.request.id === requestId
      );

      const latest = filteredById.pop();
      if (!latest) {
        return;
      }

      const updateNeeded =
        !['get', 'delete', 'head'].includes(latest.method) &&
        requestBody != undefined;

      if (updateNeeded) {
        latest.rawType = mediaType;
        latest.body = requestBody;
      }

      state.openApiReqArray.push(latest);
    },
  },
});

export const {
  requestBodyUpdated,
  openApiRequestsReplaced,
  newParameterAdded,
  newServerAdded,
} = newRequestOpenApiSlice.actions;
export default newRequestOpenApiSlice.reducer;

