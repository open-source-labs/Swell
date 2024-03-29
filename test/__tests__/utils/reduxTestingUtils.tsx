/**
* This component is the custom render function to test Redux (More info: https://redux.js.org/usage/writing-tests).
* The gist: We are creating a new Redux store instance every time the function is 
* called - in this scenario exery time we run a test. We COULD pass in the already established
* store instance, but I believe since Swell is currently mutating state directly it's better to create a new store
* for testing purposes.
*
* @todo This test is currently written in JS - to update to TS.
* @todo For now, Jest is configured to ignore this file.
* Without tests included here, Jest reports this file as failing because it expects it to have tests.
* This file has been added to the testPathIgnorePatterns option in jest.config.js.
* Remove this file from the testPathIgnorePatterns option when tests are added.
* 
* Log from github CI jest testing, when file has no tests and is not ignored:
* FAIL test/__tests__/utils/reduxTestingUtils.tsx
*  ● Test suite failed to run
* Your test suite must contain at least one test.
**/


import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
// As a basic setup, import your same slice reducers
import IntrospectionDataReducer from '../../../src/client/toolkit-refactor/slices/introspectionDataSlice'

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: { user: IntrospectionDataReducer }, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}