/**
 * @file Slice for managing introspection data from GraphQL.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $NotUsed, IntrospectionData } from '../../../types';

const initialState: IntrospectionData = {
  schemaSDL: null,
  clientSchema: null,
};

const introspectionDataSlice = createSlice({
  name: 'introspectionData',
  initialState,
  reducers: {
    //dataChanged previously SET_INTROSPECTION_DATA or setIntrospectionData
    dataChanged: (
      _state: $NotUsed,
      action: PayloadAction<IntrospectionData>
    ) => {
      return action.payload;
    },
  },
});

export const { dataChanged } = introspectionDataSlice.actions;
export default introspectionDataSlice.reducer;

