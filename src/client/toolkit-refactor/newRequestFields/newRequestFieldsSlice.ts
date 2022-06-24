/**
 * @file Defines the slice for the NewRequestFields.
 */
import { $NotUsed, $TSFixMe, ActionsToSliceReducers } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetComposerFields } from '../_temp/_sharedActions';

/**
 * Defines the type constract for the NewRequestFields state object.
 *
 * @todo See if it makes sense to redefine some of the properties to be
 * template literal types. For example, since restUrl must start with "http://",
 * type string could possibly be replaced with the type `http://${string}`.
 * Not sure if this could cause things to break, though.
 */
type NewRequestFields = {
  protocol: string;
  restUrl: string;
  wsUrl: string;
  gqlUrl: string;
  grpcUrl: string;
  webrtcUrl: string;
  url: string;
  method: string;
  graphQL: boolean;
  gRPC: boolean;
  ws: boolean;
  openapi: boolean;
  webrtc: boolean;
  webhook: boolean;
  network: string;
  testContent: string;
  testResults: $TSFixMe[];
  openapiReqObj: Record<string, $TSFixMe>;
};

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
  ws: false,
  openapi: false,
  webrtc: false,
  webhook: false,
  network: 'rest',
  testContent: '',
  testResults: [],
  openapiReqObj: {},
};

export const NewRequestFieldsSlice = createSlice({
  name: 'newRequestFields',
  initialState,

  reducers: {
    setNewRequestFields: (
      _state: $NotUsed,
      action: PayloadAction<NewRequestFields>
    ) => {
      return action.payload;
    },

    setNewTestContent: (state, action: PayloadAction<string>) => {
      state.testContent = action.payload;
    },

    [resetComposerFields]: (
      _state: $NotUsed,
      action: PayloadAction<NewRequestFields>
    ) => {
      return action.payload;
    },
  },
});

