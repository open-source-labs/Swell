import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './client/components/containers/App';
import store from './client/store';

//DO NOT HESITATE TO REACH OUT TO FORMER TEAMS BEFORE TAKING THIS ON AS A PROJECT
//There is a lot of room for improvements and we have ideas that we didn't have time to implement
//Adrian U, Jacob V, and Michael P would be glad to help. Chris and Jen can hardly contain their excitement.
//Jongsun and Colin from the previous team helped us a ton and are great dudes.

// Since we are using HtmlWebpackPlugin WITHOUT a template,
// we should create our own root node in the body element before rendering into it
const root = document.createElement('div');

root.id = 'root';
document.body.appendChild(root);

render(
  // wrap the App in the Provider and pass in the store
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
