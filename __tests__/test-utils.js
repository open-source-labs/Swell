// test-utils.js
import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "../src/client/reducers/index.js";
// const initialState = {
//   currentTab: "First Tab",
//   reqResArray: [],
//   history: [],
//   collections: [],
//   warningMessage: "",
//   newRequestFields: {
//     protocol: "",
//     url: "http://",
//     method: "GET",
//     graphQL: false,
//     gRPC: false,
//   },
//   newRequestHeaders: {
//     headersArr: [],
//     count: 0,
//   },
//   newRequestStreams: {
//     streamsArr: [],
//     count: 0,
//     streamContent: [],
//     selectedPackage: null,
//     selectedRequest: null,
//     selectedService: null,
//     selectedStreamingType: null,
//     initialQuery: null,
//     queryArr: null,
//     protoPath: null,
//     services: null,
//     protoContent: "",
//   },
//   newRequestCookies: {
//     cookiesArr: [],
//     count: 0,
//   },
//   newRequestBody: {
//     bodyContent: "",
//     bodyVariables: "",
//     bodyType: "raw",
//     rawType: "Text (text/plain)",
//     JSONFormatted: true,
//   },
//   newRequestSSE: {
//     isSSE: false,
//   },
// };
// function render(
//   ui,
//   {
//     initialState,
//     store = createStore(reducers, initialState),
//     ...renderOptions
//   }
// ) {
//   function Wrapper({ children }) {
//     return <Provider store={store}>{children}</Provider>;
//   }
//   return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
// }
// // re-export everything
// export * from "@testing-library/react";
// // override render method
// export { render };
const renderWithRedux = (
  component,
  { initialState, store = createStore(reducer, initialState) } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};
