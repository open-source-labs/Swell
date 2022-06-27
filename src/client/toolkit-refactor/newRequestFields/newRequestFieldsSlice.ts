/**
 * @file Defines the slice for the NewRequestFields.
 */
import { $NotUsed, $TSFixMe } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const newRequestFieldsSlice = createSlice({
  name: 'newRequestFields',
  initialState,

  reducers: {
    // Previously SET_NEW_REQUEST_FIELDS/setNewRequestFields
    newRequestFields: (
      _state: $NotUsed,
      action: PayloadAction<NewRequestFields>
    ) => {
      return action.payload;
    },

    // Previously SET_NEW_TEST_CONTENT/setNewTestContent
    newTestContent: (
      state,
      action: PayloadAction<NewRequestFields['testContent']>
    ) => {
      state.testContent = action.payload;
    },

    // Previously RESET_COMPOSER_FIELDS/resetComposerFields
    composerFieldsReset: () => {
      return initialState;
    },
  },
});

export const { newRequestFields, newTestContent, composerFieldsReset } =
  newRequestFieldsSlice.actions;
export default newRequestFieldsSlice.reducer;

