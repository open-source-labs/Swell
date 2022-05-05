import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { orange } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './client/components/containers/App';
import store from './client/store';

//DO NOT HESITATE TO REACH OUT TO FORMER TEAMS BEFORE TAKING THIS ON AS A PROJECT
//There is a lot of room for improvements and we have ideas that we didn't have time to implement
//Adrian U, Jacob V, and Michael P would be glad to help. Chris and Jen can hardly contain their excitement.
//Jongsun and Colin from the previous team helped us a ton and are great dudes.

// Since we are using HtmlWebpackPlugin WITHOUT a template,
// we should create our own root node in the body element before rendering into it

// MUI theme
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#001033',
    },
    secondary: {
      main: '#009279',
    },
  },
});

{/* <ThemeProvider theme={outerTheme}>
  <Checkbox defaultChecked />
  <ThemeProvider theme={innerTheme}>
    <Checkbox defaultChecked />
  </ThemeProvider>
</ThemeProvider> */}

// https://content-security-policy.com/
// add CSP
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
const head = document.querySelector('head');

const meta = document.createElement('meta');
meta.httpEquiv = 'Content-Security-Policy';
meta.content = `
  default-src 'self' http://localhost:3000 ws://localhost:3000 https://api.github.com 'unsafe-inline';
  img-src 'self' data: https://avatars.githubusercontent.com/;
  child-src 'none';`;
head.appendChild(meta);

// Render the app
const container = document.getElementById('root');
const rt = createRoot(container);
rt.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
