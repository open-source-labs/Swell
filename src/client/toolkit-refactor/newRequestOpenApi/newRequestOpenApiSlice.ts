/**
 * @file
 *
 * Remember: this is Redux Toolkit. Returning undefined is valid, because
 * Toolkit runs some processes after the reducer runs to merge the Immer object
 * into the previous state.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { compose } from 'redux';
import { $NotUsed, $TSFixMe, $TSFixMeObject } from '../../../types';

/*test file expects newRequestsOpenAPI to equal THIS PAYLOAD below
  //from actions file:
    export const setNewRequestsOpenAPI = ({
      openapiMetadata,
      openapiReqArray,
    }: Record<string, unknown>): {
      type: string;
      payload: Record<string, unknown>;
    } => ({
      type: types.SET_NEW_REQUESTS_OPENAPI,
      payload: { openapiMetadata, openapiReqArray },
    });
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
  // with any to "temporarily" turn off type-checking (with how this project
  // tends to go, these types might be stuck like this for months/years)
  body: string | $TSFixMe;
  mediaType: string | $TSFixMe;
  rawType: string | $TSFixMe;
};

export type NewRequestOpenApi = {
  openApiMetadata: {
    info: Record<string, $TSFixMe>;
    tags: $TSFixMe[];
    serverUrls: $TSFixMe[];
  };

  openApiReqArray: OpenApiRequest[];
};

type Temp2 = {
  id: number;
  location: 'path' | 'query' | 'header' | 'cookie';
  name: $TSFixMe;
  value: $TSFixMe;
};

type Temp3 = {
  requestId: number;
  mediaType: string;
  requestBody: $TSFixMeObject;
};

const initialState: NewRequestOpenApi = {
  openApiMetadata: {
    info: {},
    tags: [],
    serverUrls: [],
  },
  openApiReqArray: [],
};

export const newRequestOpenApiSlice = createSlice({
  name: 'newRequestOpenApi',
  initialState,
  reducers: {
    // Previously SET_NEW_REQUESTS_OPENAPI
    requestsReplaced(
      _state: $NotUsed,
      action: PayloadAction<NewRequestOpenApi>
    ) {
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
    newServerAdded(state, action: PayloadAction<OpenApiRequest>) {
      const { id } = action.payload.request;
      const filteredById = state.openApiReqArray.filter(
        (reqObj) => reqObj.request.id === id
      );

      // Previous logic only ever looked for the most recent element; not sure
      // why, though – is there any special meaning, or was this just a clumsy
      // attempt at saving keystrokes?
      const reqToBeUpdated = filteredById.pop();
      if (reqToBeUpdated == undefined) {
        return;
      }

      const serverIds = new Set(action.payload.serverIds);
      reqToBeUpdated.reqServers = state.openApiMetadata.serverUrls.filter(
        (_, i) => serverIds.has(i)
      );

      state.openApiReqArray.push(reqToBeUpdated);
    },

    // Previously SET_NEW_OPENAPI_PARAMETER
    newParameterAdded(state, action: PayloadAction<Temp2>) {
      const { id, location, name, value } = action.payload;
      const filteredById = state.openApiReqArray.filter(
        (entry) => entry.request.id === id
      );

      // Guard clause checks for when filtered array is empty
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

    // Previously SET_NEW_OPENAPI_REQUEST_BODY
    requestBodyUpdated(state, action: PayloadAction<Temp3>) {
      const { requestId, mediaType, requestBody } = action.payload;
      const filteredById = state.openApiReqArray.filter(
        (reqResObj) => reqResObj.request.id === requestId
      );

      const latest = filteredById.pop();
      if (latest == undefined) {
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

/**
 * During runtime, this just throws an error. For development, this will make
 * sure that every single argument passed in is of type never.
 *
 * @example Say you have a variable x, whose type is a union of the discrete
 * string values "A" | "B" | "C". You can use this function with x to make sure
 * you're taking care of all three cases properly.
 *
 * switch (x) {
 *  case "A": {
 *    return;
 *  }
 *  case "B": {
 *    return;
 *  }
 *  default: {
 *    checkTypeExhaustion(x);
 *  }
 * }
 *
 * In the above example, VS Code will yell at you because you didn't have
 * anything for case "C". So the type of x can still be the string literal "C",
 * which has no overlap with type never. You'd have to add a case for "C" to get
 * VS Code to stop yelling at you.
 */
function assertTypeExhaustion(..._: never[]): never {
  throw new Error('Not all types have been exhausted properly');
}

