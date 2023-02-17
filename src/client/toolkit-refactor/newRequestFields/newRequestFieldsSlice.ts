/**
 * @file Defines the slice for the NewRequestFields.
 */
import { NewRequestFields } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { composerFieldsReset } from '../newRequest/newRequestSlice';
import { StateEffect } from '@uiw/react-codemirror';

const initialState: NewRequestFields = {
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
  tRPC: false,
  ws: false,
  openapi: false,
  webrtc: false,
  webhook: false,
  network: 'rest',
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
    newRequestFieldsByProtocol: (state, action: PayloadAction<string>) => {
      switch (action.payload) {
        /**
         * @TODO add tRPC state management
         */
        case 'tRPC': {
          return {
            ...initialState,
            url: initialState.restUrl,
            method: 'QUERY',
            tRPC: true,
          }
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
            //??? might need to fix url vvv if we want to pass our url api from the state
            url: '',
            method: 'Webhook',
            webhook: true,
          };
        }
        default: {
          return state;
        }
      }
    }
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

