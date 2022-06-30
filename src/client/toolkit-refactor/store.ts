/**
 * @file Defines the top-level Redux store used throughout the entire app for
 * non-model data.
 *
 * Please do not put temporary form state in the store. All of that can be done
 * with local state management, via things like React hooks and the Context API.
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
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;

