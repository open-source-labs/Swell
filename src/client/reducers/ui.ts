import * as types from '../actions/actionTypes';

const initialState = {
  composerDisplay: 'Request',
  sidebarActiveTab: 'composer',
  workspaceActiveTab: 'workspace',
  responsePaneActiveTab: 'events',
  isDark: false,
};

const uiReducer = (state = initialState, action: { type: string; payload: string | boolean; }): Record<string, unknown> => {
  switch (action.type) {
    case types.SET_COMPOSER_DISPLAY: {
      return {
        ...state,
        composerDisplay: action.payload,
      };
    }

    case types.SET_SIDEBAR_ACTIVE_TAB: {
      return {
        ...state,
        sidebarActiveTab: action.payload,
      };
    }
    case types.SET_WORKSPACE_ACTIVE_TAB: {
      return {
        ...state,
        workspaceActiveTab: action.payload,
      };
    }

    case types.SET_RESPONSE_PANE_ACTIVE_TAB: {
      return {
        ...state,
        responsePaneActiveTab: action.payload,
      };
    }

    case types.TOGGLE_DARK_MODE: {
      return {
        ...state,
        isDark: action.payload,
      };
    }

    default:
      return state;
  }
};

export default uiReducer;
