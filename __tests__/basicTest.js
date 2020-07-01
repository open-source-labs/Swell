import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import format from "date-fns/format";
import uuid from "uuid/v4";
import { render, screen, fireEvent } from "@testing-library/react";
import HistoryContainer from "../src/client/components/containers/HistoryContainer";
import * as actions from "../src/client/actions/actions.js";
import reducers from "../src/client/reducers/index.js";
import "@testing-library/jest-dom/extend-expect";
// import store from "../src/client/store";
import { getAllByAltText, queryAllByRole } from "@testing-library/react";

//generate date for today
let today = new Date();
//generate date for yesterday
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
//generate date for two days prior
let twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);


describe("history container test", () => {
  const initialState = {
    business: {history: [
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
  }}
  const renderWithRedux = (
    component,
    { store = createStore(reducers, initialState) } = {}
  ) => {
    console.log('store is: ', store.getState())
    console.log('initial state is: ', initialState)
    return {
      ...render(<Provider store={store}>{component}</Provider>),
      store,
    }
  }

  beforeEach(() => {
    renderWithRedux(<HistoryContainer />); 
    screen.debug();
  });
  test("renders history from store", () => {
    console.log(screen.queryAllByRole("queryDate"));
    expect(screen.queryAllByRole("queryDate").length).toBe(3);
  });
  // test('renders a history header', () => {
  //   expect(screen.queryByRole('queryDate')).toBeInTheDocument();
  // })
});
//test if container renders
// test("renders", () => {
//   render(<HistoryContainer />);

//   screen.debug();
// });

//

/* FOR EACH COMPONENT - UNIT TESTING */
//renders
//buttons work (clear history, etc.)
//forms function (accepts input)
//state updates appropriately

