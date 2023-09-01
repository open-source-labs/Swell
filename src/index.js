/**
 * @file Defines the main entrypoint for the Swell app's frontend.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './client/components/App';
import store from './client/toolkit-refactor/store';

import { CssBaseline } from '@mui/material';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our
// own root node in the body element before rendering into it

// Sets up Material UI theme
const theme = createTheme({
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

/**
 * Adds Content Security Policy
 * https://content-security-policy.com/
 *
 * @todo Migrate all this logic into the Webpack config file
 */
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
const head = document.querySelector('head');

const meta = document.createElement('meta');
meta.httpEquiv = 'Content-Security-Policy';
meta.content = `
default-src 'self' http://localhost:3000 ws://localhost:3000 https://api.github.com 'unsafe-inline' 'unsafe-eval' * self blob: data: gap:;  
  img-src 'self' data: https://avatars.githubusercontent.com/;
  child-src 'none';
  `;

//<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
const otherMeta = document.createElement('otherMeta');
otherMeta.content = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">`;
//meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; script-src 'self' 'unsafe-eval'"

head.appendChild(meta);

// Render the app
const container = document.getElementById('root');
if (container === null) {
  throw new Error('Missing root container');
}

const reactRoot = createRoot(container);

/**
 * @todo This line is only needed for the integration testing, so it should be
 * moved to those files. As a general tip, directly modifying the global scope
 * is far less safer than accessing a value through a JS module, and has more
 * security risks.
 *
 * Moving this into the files also gives Jest the chance to clean up this setup
 * step afterwards (via beforeAll/afterAll).
 */
window.getReduxState = () => store.getState();

reactRoot.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </ThemeProvider>
);
