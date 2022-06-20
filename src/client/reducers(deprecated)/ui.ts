/**
 * @file Defines the reduction logic for just the UI part of the app.
 *
 * If all the properties here are non-model state, this file might be overkill,
 * and could maybe be deleted in favor of using the React context API.
 */

import * as ActionTypes from '../actions(deprecated)/actionTypes';

/**
 * Defines the type contract for the UI slice of the Redux store.
 * @todo Figure out what all the properties in the interface correspond to.
 */
type UiState = {
  composerDisplay: string;
  sidebarActiveTab: string;
  workspaceActiveTab: string;
  responsePaneActiveTab: string;

  /**
   * @todo See if payload type can be safely set as just boolean. Not sure why
   * this would ever need to be a string.
   */
  isDark: boolean | string;
};

/**
 * Defines all actions that can possibly be used when reducing the UI state.
 */
type UiAction =
  | {
      type: typeof ActionTypes.SET_COMPOSER_DISPLAY;
      payload: UiState['composerDisplay'];
    }
  | {
      type: typeof ActionTypes.SET_SIDEBAR_ACTIVE_TAB;
      payload: UiState['sidebarActiveTab'];
    }
  | {
      type: typeof ActionTypes.SET_WORKSPACE_ACTIVE_TAB;
      payload: UiState['workspaceActiveTab'];
    }
  | {
      type: typeof ActionTypes.SET_RESPONSE_PANE_ACTIVE_TAB;
      payload: UiState['responsePaneActiveTab'];
    }
  | { type: typeof ActionTypes.TOGGLE_DARK_MODE; payload: UiState['isDark'] };

/**
 * Defines the starting value for the UI state.
 */
const initialState: UiState = {
  composerDisplay: 'Request',
  sidebarActiveTab: 'composer',
  workspaceActiveTab: 'workspace',
  responsePaneActiveTab: 'events',
  isDark: false,
};

/**
 * Defines the reducer for the UI
 */
const uiReducer = (
  state: UiState = initialState,
  action: UiAction
): UiState => {
  switch (action.type) {
    case ActionTypes.SET_COMPOSER_DISPLAY: {
      return {
        ...state,
        composerDisplay: action.payload,
      };
    }

    case ActionTypes.SET_SIDEBAR_ACTIVE_TAB: {
      return {
        ...state,
        sidebarActiveTab: action.payload,
      };
    }

    case ActionTypes.SET_WORKSPACE_ACTIVE_TAB: {
      return {
        ...state,
        workspaceActiveTab: action.payload,
      };
    }

    case ActionTypes.SET_RESPONSE_PANE_ACTIVE_TAB: {
      return {
        ...state,
        responsePaneActiveTab: action.payload,
      };
    }

    case ActionTypes.TOGGLE_DARK_MODE: {
      return {
        ...state,
        isDark: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default uiReducer;

