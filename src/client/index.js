import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/containers/App.jsx';
import store from './store';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)

render(
    // wrap the App in the Provider and pass in the store
    <Provider store={store}>
        <App></App>
    </Provider>,
    document.getElementById('root')
);



