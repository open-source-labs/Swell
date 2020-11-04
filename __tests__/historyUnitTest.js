// using react-testing-library instead of enzyme as it seems like a better idea.
// google the enzyme shallow problem
// currently we can't find a way to run these tests with our current security setup (nodeIntegration false, global api instead of ipcRenderer)

import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import format from "date-fns/format";
import uuid from "uuid/v4";
import {
  render,
  screen,
  fireEvent,
  getAllByAltText,
  queryAllByRole,
} from "@testing-library/react";
import HistoryContainer from "../src/client/components/containers/HistoryContainer";
import * as actions from "../src/client/actions/actions.js";
import reducers from "../src/client/reducers/index.js";
import "@testing-library/jest-dom/extend-expect";
// import store from "../src/client/store";

//generate date for today
const today = new Date();
//generate date for yesterday
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
//generate date for two days prior
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

xdescribe("history container test", () => {
  const initialState = {
    business: {
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
    },
  };
  const renderWithRedux = (
    component,
    { store = createStore(reducers, initialState) } = {}
  ) => {
    return {
      ...render(<Provider store={store}>{component}</Provider>),
      store,
    };
  };

  beforeEach(() => {
    renderWithRedux(<HistoryContainer />);
    screen.debug();
  });
  test("renders all items in history array from store", () => {
    expect(screen.queryAllByLabelText("queryDate").length).toBe(3);
  });
  test("correctly renders headers in history container", () => {
    expect(screen.queryByText("Today")).toBeTruthy();
    expect(screen.queryByText("Yesterday")).toBeTruthy();
    expect(
      screen.queryByText(format(twoDaysAgo, "ddd, MMM D, YYYY"))
    ).toBeTruthy();
  });
  test("correctly renders url for each header in history", () => {
    expect(screen.queryByText("http://google.com")).toBeTruthy();
    expect(screen.queryByText("http://facebook.com")).toBeTruthy();
    expect(screen.queryByText("http://instagram.com")).toBeTruthy();
  });
  test("correctly renders request method for each header in history", () => {
    expect(screen.queryAllByText("GET").length).toBe(3);
  });
  test("clear history button renders", () => {
    expect(screen.queryByText("Clear History")).toBeTruthy();
  });
  /* Doesn't work in RTL at present */
  // test("clear history pop-up clears history", () => {
  //   store.dispatch(actions.clearHistory());
  //   expect(screen.queryAllByLabelText("queryDate").length).toBe(0);
  // });
});

/* FOR EACH COMPONENT - UNIT TESTING */
//renders
//buttons work (clear history, etc.)
//forms function (accepts input)
//state updates appropriately
