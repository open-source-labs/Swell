/**
 * @file Defines the top-level Redux store used throughout the entire app for
 * non-model data.
 *
 * Please do not put temporary form state in the store. All of that can be done
 * with local state management, via things like React hooks and the Context API.
 */
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

