import MockServerComposer from '../../src/client/components/main/MockServer-composer/MockServerComposer.tsx'
import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// Create a mock Redux store
const mockStore = configureStore([]);
const store = mockStore({/* Initial state here */});


describe('Mock Server Test', () => {
  it('Renders', () => {
    render(
      <Provider store = {store}>
        <MockServerComposer/>
      </Provider>
    )
  })
})