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
    // Previously setNewRequestHeaders
    newRequestHeaders: (
      state,
      action: PayloadAction<NewRequestStore['newRequestHeaders']>
    ) => {
      state.newRequestHeaders = action.payload;
    },

    // Previously setNewRequestBody
    newRequestBody: (state, action: PayloadAction<NewRequestBody>) => {
      state.newRequestBody = action.payload;
    },

    // Previously setNewRequestStreams
    newRequestStreams: (state, action: PayloadAction<NewRequestStreams>) => {
      state.newRequestStreams = action.payload;
    },

    // Previously setNewRequestCookies
    newRequestCookies: (
      state,
      action: PayloadAction<NewRequestStore['newRequestCookies']>
    ) => {
      state.newRequestCookies = action.payload;
    },

    // Previously setNewRequestSSE
    newRequestSSE: (state, action: PayloadAction<boolean>) => {
      state.newRequestSSE.isSSE = action.payload;
    },

    // Previously resetComposerFields
    composerFieldsReset: () => {
      return initialState;
    },
  },
});

export const {
  newRequestHeaders,
  newRequestBody,
  newRequestCookies,
  newRequestSSE,
  newRequestStreams,
  composerFieldsReset,
} = newRequestSlice.actions;
export default newRequestSlice.reducer;

