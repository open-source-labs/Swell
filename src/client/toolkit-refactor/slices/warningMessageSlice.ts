/**
 * @file Defines the Redux Toolkit slice for working with the Warning Message
 * object and associated values.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $NotUsed } from '../../../types';

//define type for warning message object

// //from test file
// const fakeWarningMessage = {
//     err: `you can't do this to me`,
//   };
// if (warningMessage.uri) { //so warning message obj has uri property??
// {warningMessage ? <div>{warningMessage.body}</div> : null} //has body property??

type WarningMessage = Partial<{
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

