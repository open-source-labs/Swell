import { configureStore } from '@reduxjs/toolkit';

import businessReducer from './features/business/businessSlice';
import uiReducer from './features/ui/uiSlice';

/**
 * The Redux store is set up to use the modern Redux Toolkit style.
 * {@link https://redux-toolkit.js.org/}
 *
 * @todo Replace all instances of Date objects in the Redux store with timestamp
 * strings. Redux will complain that the data isn't serializable, because Dates
 * aren't part of the JSON spec, but when you call JSON.stringify on an object
 * that contains Dates, they'll automatically have their .toString method
 * called, turning them into timestamp strings.
 *
 * So basically, the data technically is serializable, but Redux can't tell that
 * and will keep yelling at you in the console until all the Dates are replaced.
 */
const store = configureStore({
  reducer: {
    business: businessReducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
