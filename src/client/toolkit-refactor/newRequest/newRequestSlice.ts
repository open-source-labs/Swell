/**
 * @file Defines the slice for the new requests
 * 
 * slice contains request body and header information
 * 
 * @todo should be combined with new Request fields slice as the data related to constructing
 * each request is associated
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  NewRequestStreams,
  NewRequestBody,
  SSERequest,
  CookieOrHeader,
} from '../../../types';

type NewRequestStore = {
  newRequestHeaders: {
    headersArr: CookieOrHeader[];
    count: number;
  };
  newRequestStreams: NewRequestStreams;
  newRequestCookies: {
    cookiesArr: CookieOrHeader[];
    count: number;
  };
  newRequestBody: NewRequestBody;
  newRequestSSE: SSERequest;
};

const initialState: NewRequestStore = {
  newRequestHeaders: {
    headersArr: [],
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
  newRequestSSE: {
    isSSE: false,
  },
};

const newRequestSlice = createSlice({
  name: 'newRequest',
  initialState,
  reducers: {
    //Before toolkit conversion was SET_NEW_REQUEST_HEADERS or setNewRequestHeaders
    newRequestHeadersSet: (
      state,
      action: PayloadAction<NewRequestStore['newRequestHeaders']>
    ) => {
      state.newRequestHeaders = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_BODY or setNewRequestBody
    newRequestBodySet: (state, action: PayloadAction<NewRequestBody>) => {
      state.newRequestBody = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_STREAMS or setNewRequestStreams
    newRequestStreamsSet: (state, action: PayloadAction<NewRequestStreams>) => {
      state.newRequestStreams = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_COOKIES or setNewRequestCookies
    newRequestCookiesSet: (
      state,
      action: PayloadAction<NewRequestStore['newRequestCookies']>
    ) => {
      state.newRequestCookies = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_SSE or setNewRequestSSE
    newRequestSSESet: (state, action: PayloadAction<boolean>) => {
      state.newRequestSSE.isSSE = action.payload;
    },

    //Before toolkit conversion was RESET_COMPOSER_FIELDS or resetComposerFields
    composerFieldsReset: () => {
      return initialState;
    },

    // this reducer should only be invoked in conjunction with the newRequestFieldsByProtocol reducer
    newRequestContentByProtocol: (state, action: PayloadAction<string>) => {
      switch (action.payload) {
        case 'tRPC': {
          return {
            ...initialState,
            bodyType: 'TRPC',
            bodyVariables: '',
          };
        }
        case 'graphQL': {
          return {
            ...initialState,
            bodyType: 'GQL',
            bodyVariables: '',
          };
        }
        case 'rest': {
          return {
            ...initialState,
            bodyType: 'none',
            bodyContent: ``,
          };
        }
        case 'openapi': {
          return {
            ...initialState,
            bodyType: 'none',
            bodyContent: '',
          };
        }
        case 'grpc': {
          return {
            ...initialState,
            bodyType: 'GRPC',
            bodyContent: ``,
          };
        }
        case 'ws': {
          return {
            ...initialState,
            bodyType: 'none',
            bodyContent: '',
          };
        }
        case 'webrtc': {
          return {
            ...initialState,
            bodyType: 'stun-ice',
            newRequestBody: {
              bodyContent: {
                iceConfiguration: {
                  iceServers: [
                    {
                      urls: 'stun:stun1.l.google.com:19302',
                    },
                  ],
                },
              },
            }
          };
        }
        case 'webhook': {
          return {
            ...initialState,
            bodyType: 'none',
          };
        }
        default:
          return state;
      }
    },
  }
});

export const {
  newRequestHeadersSet,
  newRequestBodySet,
  newRequestCookiesSet,
  newRequestSSESet,
  newRequestStreamsSet,
  composerFieldsReset,
  newRequestContentByProtocol
} = newRequestSlice.actions;
export default newRequestSlice.reducer;

