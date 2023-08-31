/**
 * Defines the top-level Redux store that should be used throughout the entire
 * app for global state, as well as any related utiliites.
 * {@link https://redux-toolkit.js.org/}
 *
 * Please do not put any arbitrary state values in here. useState and useReducer
 * can be used for state that only belongs to one component. Form state should
 * almost never go in here. Redux state is still global state, and even when you
 * opt into Redux's Flux Standard Actions approach, it can be hard to debug.
 *
 * Also, please do not use the raw useSelector or useDispatch hooks from the
 * react-redux library. These are not type-safe. Use the useAppSelector and
 * useAppDispatch hooks exported here. They work the same, but have type safety.
 *
 * Reminder: all values in a Redux store must be JSON-serializable values in
 * order to be proper. Only these types are valid (defined recursively):
 * - Strings
 * - Numbers
 * - Booleans
 * - null
 * - Arrays of JSON values
 * - Objects of JSON values (instantiated objects like Date are not allowed)
 *
 * All other values (including undefined and functions) are not valid.
 *
 * @todo With that said, parts of the Redux store still have Date objects, and
 * by default, Redux will yell at you. In practice, it shouldn't cause problems
 * (trying to access a Date object as a string will automatically call its
 * .toString method on it), but because Redux doesn't know that, it'll keep
 * yelling. All Dates should be replaced with date strings or timestamp numbers
 */
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import {
  type TypedUseSelectorHook,
  useSelector,
  useDispatch,
} from 'react-redux';

/**
 * The top-level redux store.
 */
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /**
       * @todo Remove any non-serializable values from the store (namely,
       * replace Date objects with strings/numbers), and flip this to true.
       */
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * The Redux store's dispatch function, exposed directly; needed for files that
 * are not React function components.
 */
export const appDispatch = store.dispatch;

/**
 * A type-safe version of React-Redux's useDispatch hook.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * A type-safe version of React-Redux's useSelector hook.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

