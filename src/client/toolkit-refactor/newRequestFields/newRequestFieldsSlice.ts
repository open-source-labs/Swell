/**
 * @file Defines the slice for the NewRequestFields.
 *
 * slice contains general request information
 *
 * @todo should be combined with new Request slice as the data related to constructing
 * each request is linked with
 *
 * @todo refactor request type state into a single state with descrete options
 */
import { NewRequestFields } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { composerFieldsReset } from '../newRequest/newRequestSlice';

const initialState: NewRequestFields = {
  protocol: '',
  method: 'GET',
  network: 'rest',
  url: 'http://',

  // it is unclear how request specific urls function in the app, useage is inconsistent
  // reccomend treating as constants and URL property should be variable
  // as there is only one url per request
  // can be refactored out of the app
  restUrl: 'http://',
  wsUrl: 'ws://',
  gqlUrl: 'https://',
  grpcUrl: '',
  webrtcUrl: '',

  // the purpose of these booleans is unclear, inconsistent useage throughout app
  // should be refactored into a single piece of state
  // with descrete options that indicate the type of request
  // a request cannot be gRPC and tRPC at the same time
  graphQL: false,
  gRPC: false,
  tRPC: false,
  ws: false,
  openapi: false,
  webrtc: false,
  webhook: false,

  testContent: '',
  testResults: [],
  openapiReqObj: {},
};

const newRequestFieldsSlice = createSlice({
  name: 'newRequestFields',
  initialState,

  reducers: {
    //Before toolkit conversion was SET_NEW_REQUEST_FIELDS or setNewRequestFields
    fieldsReplaced: (_, action: PayloadAction<NewRequestFields>) => {
      return action.payload;
    },

    //Before toolkit conversion was SET_NEW_TEST_CONTENT or setNewTestContent
    newTestContentSet: (
      state,
      action: PayloadAction<NewRequestFields['testContent']>
    ) => {
      state.testContent = action.payload;
    },

    // sets inital request state when a protocol is selected
    newRequestFieldsByProtocol: (state, action: PayloadAction<string>) => {
      switch (action.payload) {
        case 'tRPC': {
          return {
            ...initialState,
            url: initialState.restUrl,
            method: 'QUERY',
            tRPC: true,
          };
        }
        case 'graphQL': {
          return {
            ...initialState,
            url: initialState.gqlUrl,
            method: 'QUERY',
            graphQL: true,
          };
        }
        case 'rest': {
          return {
            ...initialState,
            url: initialState.restUrl,
            method: 'GET',
          };
        }
        case 'openapi': {
          return {
            ...initialState,
            url: '',
            method: 'GET',
            network: 'openapi',
          };
        }
        case 'grpc': {
          return {
            ...initialState,
            url: initialState.grpcUrl,
            method: '',
            gRPC: true,
          };
        }
        case 'ws': {
          return {
            ...initialState,
            url: initialState.wsUrl,
            method: '',
            ws: false,
            network: 'ws',
          };
        }
        case 'webrtc': {
          return {
            ...initialState,
            url: initialState.webrtcUrl,
            method: 'WebRTC',
            webrtc: true,
          };
        }
        case 'webhook': {
          return {
            ...initialState,
            url: '',
            method: 'Webhook',
            webhook: true,
          };
        }
        case 'mock': {
          return {
            ...initialState,
            url: '',
            method: 'GET',
          };
        }
        default: {
          return state;
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(composerFieldsReset, () => {
      return initialState;
    });
  },
});

export const { fieldsReplaced, newTestContentSet, newRequestFieldsByProtocol } =
  newRequestFieldsSlice.actions;
export default newRequestFieldsSlice.reducer;

