/**
 * @file Defines state management for just the UI part of the app.
 *
 * If all the properties here are non-model state, this file might be overkill,
 * and could maybe be deleted in favor of using the React context API and non-
 * global/hooks-based state.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarActiveTab: string;
  workspaceActiveTab: string;
  responsePaneActiveTab: string;
  /**
   * @todo - dark mode not enabled or implemented, either complete feature or
   * remove this piece of state and it's references, but make sure all other
   * functionality still good
   * */
  isDark: boolean;
}

const initialState: UiState = {
  /**
   * @todo 2023-08-31 - From a cursory glance, it seems that the value of this
   * property will only ever be "workspace". Not sure if there was ever any
   * intention to add support for other values, too.
   */
  workspaceActiveTab: 'workspace',
  sidebarActiveTab: 'composer',
  responsePaneActiveTab: 'events',
  isDark: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarActiveTab(state, action: PayloadAction<string>) {
      state.sidebarActiveTab = action.payload;
    },
    setWorkspaceActiveTab(state, action: PayloadAction<string>) {
      state.workspaceActiveTab = action.payload;
    },
    setResponsePaneActiveTab(state, action: PayloadAction<string>) {
      state.responsePaneActiveTab = action.payload;
    },
    toggleDarkMode(state, action: PayloadAction<boolean>) {
      state.isDark = action.payload;
    },
  },
});

export const {
  setSidebarActiveTab,
  setWorkspaceActiveTab,
  setResponsePaneActiveTab,
  toggleDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer;

