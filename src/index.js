/**
 * @file Defines the main entrypoint for the Swell app's frontend.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './client/components/App';
import store from './client/toolkit-refactor/store';

import { CssBaseline } from '@mui/material';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our
// own root node in the body element before rendering into it

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
      main: '#aeaeae', // Assuming this is the primary color for dark mode
    },
    secondary: {
      main: '#1f282e', // Assuming this is the secondary color for dark mode
    },
    background: {
      default: '#434343', // This is the neutral-500 color from your SCSS
    },
    text: {
      primary: '#00000099', // This is the text color from your SCSS
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
const rt = createRoot(container);

// Created this method to allow Redux State to be accessible in Integration testing
window.getReduxState = () => store.getState();

rt.render(
 <Provider store={store}>
    <ThemedApp />
 </Provider>
);