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
    //Before toolkit conversion was SET_INTROSPECTION_DATA or setIntrospectionData
    introspectionDataChanged: (
      _state: $NotUsed,
      action: PayloadAction<IntrospectionData>
    ) => {
      return action.payload;
    },
  },
});

export const { introspectionDataChanged } = introspectionDataSlice.actions;
export default introspectionDataSlice.reducer;

