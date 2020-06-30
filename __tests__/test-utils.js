// test-utils.js
import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import format from "date-fns/format";
import reducers from "../src/client/reducers/index.js";

let today = new Date();
//generate date for yesterday
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
//generate date for two days prior
let twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const initialState = {
  currentTab: "First Tab",
  reqResArray: [],
  history: [
    {
      date: format(today, "MM/DD/YYYY"),
      history: [
        {
          id: 1,
          created_at: today,
          url: "http://google.com",
          request: {
            method: "GET",
          },
        },
      ],
    },
    {
      date: format(yesterday, "MM/DD/YYYY"),
      history: [
        {
          id: 2,
          created_at: yesterday,
          url: "http://facebook.com",
          request: {
            method: "GET",
          },
        },
      ],
    },
    {
      date: format(twoDaysAgo, "MM/DD/YYYY"),
      history: [
        {
          id: 3,
          created_at: twoDaysAgo,
          url: "http://instagram.com",
          request: {
            method: "GET",
          },
        },
      ],
    },
  ],
  collections: [],
  warningMessage: "",
  newRequestFields: {
    protocol: "",
    url: "http://",
    method: "GET",
    graphQL: false,
    gRPC: false,
  },
  newRequestHeaders: {
    headersArr: [],
    count: 0,
  },
  newRequestStreams: {
    streamsArr: [],
    count: 0,
    streamContent: [],
    selectedPackage: null,
    selectedRequest: null,
    selectedService: null,
    selectedStreamingType: null,
    initialQuery: null,
    queryArr: null,
    protoPath: null,
    services: null,
    protoContent: "",
  },
  newRequestCookies: {
    cookiesArr: [],
    count: 0,
  },
  newRequestBody: {
    bodyContent: "",
    bodyVariables: "",
    bodyType: "raw",
    rawType: "Text (text/plain)",
    JSONFormatted: true,
  },
  newRequestSSE: {
    isSSE: false,
  },
};

function render(
  ui,
  {
    initialState = initialState,
    store = createStore(reducers, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };
