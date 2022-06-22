/**
 * @file Defines slice for working with collection values.
 *
 * @todo Figure out exactly what a collection is.
 * @todo CHeck the forEach calls in deleteCollection to see if the splices cause
 * elements to be skipped.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection } from '../../../types';

const initialState: Collection[] = [];

const CollectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    getCollections: (state, action: PayloadAction<Collection[]>) => {
      state = action.payload;
    },

    deleteCollection: (state, action: PayloadAction<Collection>) => {
      /**
       * @todo Check to see if this loop is actually working. forEach splices
       * are wonky and cause elements to be skipped
       */
      state.forEach((obj, i) => {
        if (obj.id === action.payload.id) {
          state.splice(i, 1);
        }
      });
    },

    collectionAdd: (state, action: PayloadAction<Collection>) => {
      state.unshift(action.payload);
    },

    collectionUpdate: (state, action: PayloadAction<Collection>) => {
      state.forEach((obj, i) => {
        if (obj.name === action.payload.name) {
          state[i] = action.payload;
        }
      });
    },
  },
});

export default CollectionsSlice;

