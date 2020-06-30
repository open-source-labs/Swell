import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import format from "date-fns/format";
import uuid from "uuid/v4";
import { render, screen, fireEvent } from "./test-utils.js";
import HistoryContainer from "../src/client/components/containers/HistoryContainer";
import HistoryDate from "../src/client/components/containers/HistoryDate";
import * as actions from "../src/client/actions/actions.js";
import "@testing-library/jest-dom/extend-expect";
import store from "../src/client/store";
import { getAllByAltText, queryAllByRole } from "@testing-library/react";

describe("history container test", () => {
  //generate date for today
  let today = new Date();
  //generate date for yesterday
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  //generate date for two days prior
  let twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  beforeEach(() => {
    render(<HistoryContainer />, {
      initialState: {
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
    });
  });
  test("renders history from store", () => {
    render(<HistoryContainer />);
    // expect(render(<HistoryContainer />)).toHaveTextContent(/^Text Content$/);
    expect(screen.queryAllByRole("heading", { name: "queryDate" }).length).toBe(
      3
    );
  });
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
