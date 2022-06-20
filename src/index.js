/**
 * @file Defines the main entrypoint for the Swell app's frontend.
 *
 * DO NOT HESITATE TO REACH OUT TO FORMER TEAMS BEFORE TAKING THIS ON AS A
 * PROJECT. There is a lot of room for improvements, and everyone has ideas that
 * there just wasn't enough time to implement.
 *
 * People who have said they'd be willing to help:
 * - Adrian U
 * - Jacob V
 * - Michael P
 * - Chris
 * - Jen
 *
 * People who have helped before, but who may or may not be available:
 * - Jongsun
 * - Colin
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './client/components/App';
import store from './client/store';

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
  default-src 'self' http://localhost:3000 ws://localhost:3000 https://api.github.com 'unsafe-inline';
  img-src 'self' data: https://avatars.githubusercontent.com/;
  child-src 'none';
  `;

head.appendChild(meta);

// Render the app
const container = document.getElementById('root');
const rt = createRoot(container);
rt.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
