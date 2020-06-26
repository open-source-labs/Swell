import * as types from "../actions/actionTypes";

const initialState = {
  warningIsDisplayed: true,
  composerDisplay: "Request",
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_WARNING: {
      return {
        ...state,
        warningIsDisplayed: true,
      };
    }

    case types.HIDE_WARNING: {
      return {
        ...state,
        warningIsDisplayed: false,
      };
    }

    case types.SET_COMPOSER_DISPLAY: {
      return {
        ...state,
        composerDisplay: action.payload,
      };
    }

    default:
      return state;
  }
};

export default uiReducer;
