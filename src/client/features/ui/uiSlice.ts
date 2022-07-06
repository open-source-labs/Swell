/**
 * @file Defines state management for just the UI part of the app.
 *
 * If all the properties here are non-model state, this file might be overkill,
 * and could maybe be deleted in favor of using the React context API and non-
 * global/hooks-based state.
 */
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface UiState {
//   sidebarActiveTab: string;
//   workspaceActiveTab: string;
//   responsePaneActiveTab: string;
//   isDark: boolean;
// }

// const initialState: UiState = {
//   sidebarActiveTab: 'composer',
//   workspaceActiveTab: 'workspace',
//   responsePaneActiveTab: 'events',
//   isDark: false,
// };

// const uiSlice = createSlice({
//   name: 'ui',
//   initialState,
//   reducers: {
//     setSidebarActiveTab(state, action: PayloadAction<string>) {
//       state.sidebarActiveTab = action.payload;
//     },
//     setWorkspaceActiveTab(state, action: PayloadAction<string>) {
//       state.workspaceActiveTab = action.payload;
//     },
//     setResponsePaneActiveTab(state, action: PayloadAction<string>) {
//       state.responsePaneActiveTab = action.payload;
//     },
//     toggleDarkMode(state, action: PayloadAction<boolean>) {
//       state.isDark = action.payload;
//     },
//   },
// });

// const { actions, reducer } = uiSlice;
// export const {
//   setSidebarActiveTab,
//   setWorkspaceActiveTab,
//   setResponsePaneActiveTab,
//   toggleDarkMode,
// } = actions;
// export default reducer;

