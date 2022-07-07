import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  },
});

export const {
  newRequestHeadersSet,
  newRequestBodySet,
  newRequestCookiesSet,
  newRequestSSESet,
  newRequestStreamsSet,
  composerFieldsReset,
} = newRequestSlice.actions;
export default newRequestSlice.reducer;

