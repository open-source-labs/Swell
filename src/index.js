/**
 * @file Defines the main entrypoint for the Swell app's frontend.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './client/components/App';
import store from './client/toolkit-refactor/store';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';

// // Moved index.html rendering logic into Webpack Template to make use of CSP meta tag options


// This was the original theme before DarkMode Toggling was added
// // Sets up Material UI theme
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#51819b',
//     },
//     secondary: {
//       main: '#f0f6fa',
//     },
//   },
// });

// Light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#51819b',
    },
    secondary: {
      main: '#f0f6fa',
    },
  },
});

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#51819b',
    },
    secondary: {
      main: '#f0f6fa',
    },
    background: {
      default: '#1f282e', // This is the neutral-400 color from darkMode.scss
    },
    text: {
      primary: '#FFFFFF', // This is the text color from darkMode.scss
    },
  },
});

function ThemedApp() {
  // Access the isDark state from the Redux store
  const isDark = useSelector((state) => state.ui.isDark);

  // Determine the theme based on the isDark state
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

/**
 * TODO: Find a way to parse nonce and add it to the MUI cache so 'unsafe-inline' can also be removed
 * TODO: Randomly generate nonce on app launch (within index.js?)
 * * Currently nonce is generated once per build via Webpack per previous Teams -- may be an issue when building exe/dmg for distribution
 * * Due to the nature of Electron.js -- not using backend to generate nonce per request
 * * nonce for style is disabled right now due to dynamic css
 */

// Cache to catch Material UI Dynamic Elements and append tags to it for nonce
const cache = createCache({
  key: 'swell-mui',
  // nonce: nonce,
  prepend: false,
});

// Render the app
const container = document.getElementById('root');
const rt = createRoot(container);

// Created this method to allow Redux State to be accessible in Integration testing
window.getReduxState = () => store.getState();

rt.render(
  <CacheProvider value={cache}>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </CacheProvider>
);
