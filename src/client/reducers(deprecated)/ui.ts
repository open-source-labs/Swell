interface UiState {
  composerDisplay: string,
  sidebarActiveTab: string,
  workspaceActiveTab: string,
  responsePaneActiveTab: string,
  isDark: boolean | string,
};

const initialState: UiState = {
  composerDisplay: 'Request',
  sidebarActiveTab: 'composer',
  workspaceActiveTab: 'workspace',
  responsePaneActiveTab: 'events',
  isDark: false,
};

const uiReducer = (state = initialState, action: Record<string, string | boolean>): UiState => {
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
