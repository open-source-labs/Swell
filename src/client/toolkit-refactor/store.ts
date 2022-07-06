/**
 * Defines the top-level Redux store that should be used throughout the entire
 * app for non-model data.
 * {@link https://redux-toolkit.js.org/}
 *
 * Please do not put temporary form state in the store. All of that can be done
 * with local state management, via things like React hooks and the Context API.
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
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from './rootReducer';

/**
 * The top-level redux store. serializableCheck was previously turned off, which
 * stops Redux from complaining at you, but the Redux store should only have
 * serializable JSON values where possible.
 *
 * @todo Remove any non-serializable values from the store (namely, replace
 * Date objects with Date strings).
 */
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * A type-safe version of React-Redux's useDispatch hook.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * The Redux store's dispatch function, exposed directly; needed for files that
 * are not React functional components.
 */
export const appDispatch = store.dispatch;
export default store;

