import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { App } from "./client/components/containers/App";
import store from "./client/store";

// Since we are using HtmlWebpackPlugin WITHOUT a template,
// we should create our own root node in the body element before rendering into it
const root = document.createElement("div");

root.id = "root";
document.body.appendChild(root);

render(
  // wrap the App in the Provider and pass in the store
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
