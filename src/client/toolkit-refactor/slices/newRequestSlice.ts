/**
 * @file Defines the Redux slice for processing new requests (e.g., request
 * body and header information).
 *
 * @todo This should probably be combined with the Request fields slice, as all
 * the data is highly interrelated. The fields slice has a Redux extra reducer
 * set up to listen for changes here, too.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  NewRequestStreams,
  NewRequestBody,
  NewRequestSSE,
  CookieOrHeader,
  RequestWebRTC,
} from '~/types';

type NewRequestState = {
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
  newRequestSSE: NewRequestSSE;
  newRequestWebRTC: RequestWebRTC;
};

const initialState: NewRequestState = {
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
    protoPath: '',
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
  newRequestWebRTC: {
    network: 'webrtc',
    webRTCEntryMode: 'Manual',
    webRTCDataChannel: 'Text',
    webRTCWebsocketServer: '',
    webRTCOffer: '',
    webRTCAnswer: '',
    webRTCpeerConnection: null,
    webRTCLocalStream: null,
    webRTCRemoteStream: null,
    webRTCMessages: [],
  },
};

const newRequestSlice = createSlice({
  name: 'newRequest',
  initialState,
  reducers: {
    //Before toolkit conversion was SET_NEW_REQUEST_HEADERS or setNewRequestHeaders
    newRequestHeadersSet: (
      state,
      action: PayloadAction<NewRequestState['newRequestHeaders']>
    ) => {
      state.newRequestHeaders = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_BODY or setNewRequestBody
    newRequestBodySet: (state, action: PayloadAction<NewRequestBody>) => {
      state.newRequestBody = action.payload;
    },

    newRequestWebRTCSet: (state, action: PayloadAction<RequestWebRTC>) => {
      state.newRequestWebRTC = action.payload;
    },
    newRequestWebRTCOfferSet: (state, action: PayloadAction<string>) => {
      state.newRequestWebRTC.webRTCOffer = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_STREAMS or setNewRequestStreams
    newRequestStreamsSet: (state, action: PayloadAction<NewRequestStreams>) => {
      state.newRequestStreams = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_COOKIES or setNewRequestCookies
    newRequestCookiesSet: (
      state,
      action: PayloadAction<NewRequestState['newRequestCookies']>
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
    newRequestContentByProtocol: (
      state,
      action: PayloadAction<string>
    ): NewRequestState => {
      const composeNewRequestStore = (bodyType: string): NewRequestState => {
        return {
          ...initialState,
          newRequestBody: {
            ...initialState.newRequestBody,
            bodyType: bodyType,
            bodyVariables: '',
          },
        };
      };

      switch (action.payload) {
        case 'tRPC': {
          return composeNewRequestStore('TRPC');
        }
        case 'graphQL': {
          return composeNewRequestStore('GQL');
        }
        case 'rest': {
          return composeNewRequestStore('none');
        }
        case 'openapi': {
          return composeNewRequestStore('none');
        }
        case 'grpc': {
          return composeNewRequestStore('GRPC');
        }
        case 'ws': {
          return composeNewRequestStore('none');
        }
        case 'webhook': {
          return composeNewRequestStore('none');
        }
        case 'mockserver': {
          return composeNewRequestStore('none');
        }
        default:
          return state;
      }
    },
  },
});

export const {
  newRequestHeadersSet,
  newRequestBodySet,
  newRequestCookiesSet,
  newRequestSSESet,
  newRequestStreamsSet,
  composerFieldsReset,
  newRequestContentByProtocol,
  newRequestWebRTCSet,
  newRequestWebRTCOfferSet,
} = newRequestSlice.actions;
export default newRequestSlice.reducer;

