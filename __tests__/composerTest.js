import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "./test-utils.js";
import HistoryContainer from "../src/client/components/containers/HistoryContainer";
import "@testing-library/jest-dom/extend-expect";
import store from "../src/client/store";
import { ElectronHttpExecutor } from "electron-updater/out/electronHttpExecutor";

test("renders", () => {
  render(<HistoryContainer />);

  screen.debug();
});

/* FOR EACH COMPONENT - UNIT TESTING */
//renders
//buttons work (clear history, etc.)
//forms function (accepts input)
//state updates appropriately
