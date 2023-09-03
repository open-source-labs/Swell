/**
 * @file Test to determine the state management for the given windows (sidebar, workspace, response pane) in the UI.
 *
 * Currently, updating the state is working properly.
 * Possibly @todo - testing for actual updates when the rendering occurs real-time?
 *
 */

import uiSliceReducer, {
  initialState,
  setSidebarActiveTab,
  setWorkspaceActiveTab,
  setResponsePaneActiveTab,
  toggleDarkMode,
} from '../../src/client/rtk/slices/uiSlice';

describe('uiSlice', () => {
  it('sidebar active window should be updated when changed', () => {
    const action = setSidebarActiveTab('composer');
    const sliceNewState = uiSliceReducer(initialState, action);
    expect(sliceNewState.sidebarActiveTab).toBe('composer');
  });

  it('workspace active window should be updated when changed', () => {
    const action = setWorkspaceActiveTab('workspace');
    const sliceNewState = uiSliceReducer(initialState, action);
    expect(sliceNewState.workspaceActiveTab).toBe('workspace');
  });

  it('response pane active window should be updated when changed', () => {
    const action = setResponsePaneActiveTab('events');
    const sliceNewState = uiSliceReducer(initialState, action);
    expect(sliceNewState.responsePaneActiveTab).toBe('events');
  });

  it('dark-mode switch should toggle correctly', () => {
    const actionOff = toggleDarkMode(false);
    const actionOn = toggleDarkMode(true);
    let sliceNewState = uiSliceReducer(initialState, actionOff);
    expect(sliceNewState.isDark).toBe(false);
    sliceNewState = uiSliceReducer(initialState, actionOn);
    expect(sliceNewState.isDark).toBe(true);
  });
});

