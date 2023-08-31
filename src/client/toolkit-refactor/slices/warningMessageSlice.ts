/**
 * @file Defines the Redux Toolkit slice for working with the Warning Message
 * object and associated values.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $NotUsed } from '../../../types';

export type WarningMessage = Partial<{
  err: string;
  uri: string;
  body: string;
}>;

//initialize warning message state
const initialState: WarningMessage = {};

const warningMessageSlice = createSlice({
  name: 'warningMessage',
  initialState,
  reducers: {
    //previously was SET_COMPOSER_WARNING_MESSAGE or setComposerWarningMessage
    setWarningMessage(_state: $NotUsed, action: PayloadAction<WarningMessage>) {
      return action.payload;
    },
  },
});

export const { setWarningMessage } = warningMessageSlice.actions;
export default warningMessageSlice.reducer;

