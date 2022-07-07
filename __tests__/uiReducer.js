/**@todo refactor for new state structure with redux slices */

// import reducer,{
//   setSidebarActiveTab,
//   setWorkspaceActiveTab,
//   setResponsePaneActiveTab,
//   toggleDarkMode,
//  } from '../src/client/features/ui/uiSlice.ts';

// describe('UI Reducer', () => {
//   let state;

//   beforeEach(() => {
//     state = {
//       isDark: false,
//       sidebarActiveTab: 'composer',
//       workspaceActiveTab: 'workspace',
//       responsePaneActiveTab: 'events',
//     };
//   });

//   describe('default state', () => {
//     it('should return a default state when given an undefined input', () => {
//       expect(reducer(undefined, { type: undefined })).toEqual(state);
//     });
//     it('should return default state with unrecognized action types', () => {
//       expect(reducer(undefined, { type: 'BAD_TYPE' })).toEqual(state);
//     });
//   });

//   describe('Set sidebar active tab', () => {
//     const action = {
//       payload: 'the active sidebar tab is this one!',
//     };

//     it('sets the sidebar active tab', () => {
//       const { sidebarActiveTab } = reducer(state, setSidebarActiveTab(action.payload));
//       expect(sidebarActiveTab).toEqual(action.payload);
//     });
//   });

//   describe('Set workspace active tab', () => {
//     const action = {
//       payload: 'the active workspace tab is this one!',
//     };

//     it('sets the workspace active tab', () => {
//       const { workspaceActiveTab } = reducer(state, setWorkspaceActiveTab(action.payload));
//       expect(workspaceActiveTab).toEqual(action.payload);
//     });
//   });

//   describe('Set response pane active tab', () => {
//     const action = {
//       payload: 'the active response pane tab is this one!',
//     };

//     it('sets the response pane active tab', () => {
//       const { responsePaneActiveTab } = reducer(state, setResponsePaneActiveTab(action.payload));
//       expect(responsePaneActiveTab).toEqual(action.payload);
//     });
//   });

//   describe('Toggle dark mode', () => {
//     const action = {
//       payload: true,
//     };

//     it('Toggles dark mode', () => {
//       const newState = reducer(state, toggleDarkMode(false));
//       expect(newState.isDark).toEqual(false);
//       const { isDark } = reducer(newState, toggleDarkMode(action.payload));
//       expect(isDark).toEqual(true);
//     });
//   });

// });
