/**
 * @file Defines slice for working with collection values.
 *
 * @todo Figure out exactly what a collection is.
 * @todo CHeck the forEach calls in deleteCollection to see if the splices cause
 * elements to be skipped.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection, $NotUsed } from '../../../types';

const initialState: Collection[] = [];

const CollectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    // Previously GET_COLLECTIONS, even though it was a setter
    replaced: (_state: $NotUsed, action: PayloadAction<Collection[]>) => {
      return action.payload;
    },

    // Previously DELETE_COLLECTION or deleteCollection
    itemDeleted: (state, action: PayloadAction<Collection>) => {
      /**
       * @todo Check to see if this loop is actually working. splices in loops
       * are wonky and cause elements to be skipped. 99% of the time, elements
       * will be skipped; need to determine if other parts of the code are
       * compensating in some way
       */
      for (const [index, obj] of state.entries()) {
        if (obj.id === action.payload.id) {
          state.splice(index, 1);
        }
      }

      /**
       * Possible replacement if splices should be corrected for:
       * return state.filter((obj) => obj.id !== action.payload.id)
       */
    },

    // Previously COLLECTION_ADD or collectionAdd
    itemAdded: (state, action: PayloadAction<Collection>) => {
      state.unshift(action.payload);
    },

    // Previously COLLECTION_UPDATE or collectionUpdate
    itemUpdated: (state, action: PayloadAction<Collection>) => {
      for (const [index, obj] of state.entries()) {
        if (obj.name === action.payload.name) {
          state[index] = action.payload;
        }
      }
    },
  },
});

export const { replaced, itemAdded, itemDeleted, itemUpdated } =
  CollectionsSlice.actions;
export default CollectionsSlice.reducer;

