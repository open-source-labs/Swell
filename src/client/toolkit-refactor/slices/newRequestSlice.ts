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
  NewRequestSSE,
  CookieOrHeader,
  RequestWebRTC,
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
  newRequestSSE: NewRequestSSE;
  newRequestWebRTC: RequestWebRTC;
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
      action: PayloadAction<NewRequestStore['newRequestHeaders']>
    ) => {
      state.newRequestHeaders = action.payload;
    },

    //Before toolkit conversion was SET_NEW_REQUEST_BODY or setNewRequestBody
    newRequestBodySet: (state, action: PayloadAction<NewRequestBody>) => {
      state.newRequestBody = action.payload;
    },

    newRequestWebRTCSet: (state, action: PayloadAction<RequestWebRTC>) => {
      state.newRequestWebRTC = action.payload;
      // console.log('newRequestWebRTCCheckAfterAnswerInReducer:', state.newRequestWebRTC.webRTCAnswer);
    },
    newRequestWebRTCOfferSet: (state, action: PayloadAction<string>) => {
      state.newRequestWebRTC.webRTCOffer = action.payload;
    },
    newRequestWebRTCAnswerSet: (state, action: PayloadAction<string>) => {
      state.newRequestWebRTC.webRTCAnswer = action.payload;
    },

    //add one for answer

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
    newRequestContentByProtocol: (
      state,
      action: PayloadAction<string>
    ): NewRequestStore => {
      const composeNewRequestStore = (bodyType: string): NewRequestStore => {
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
  newRequestWebRTCAnswerSet,
} = newRequestSlice.actions;
export default newRequestSlice.reducer;

