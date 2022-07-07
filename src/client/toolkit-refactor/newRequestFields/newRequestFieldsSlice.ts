/**
 * @file Defines the slice for the NewRequestFields.
 */
import { NewRequestFields } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { composerFieldsReset } from '../newRequest/newRequestSlice';

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
    fieldsReplaced: (_, action: PayloadAction<NewRequestFields>) => {
      return action.payload;
    },

    // Previously SET_NEW_TEST_CONTENT/setNewTestContent
    newTestContentSet: (
      state,
      action: PayloadAction<NewRequestFields['testContent']>
    ) => {
      state.testContent = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(composerFieldsReset, () => {
      return initialState;
    });
  },
});

export const { fieldsReplaced, newTestContentSet } =
  newRequestFieldsSlice.actions;
export default newRequestFieldsSlice.reducer;

