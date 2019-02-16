import * as types from '../actions/actionTypes';

const initialState = {
  isDisplayedModal: true,
  modalDisplay: 'Request',
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_MODAL: {
      return {
        ...state,
        isDisplayedModal: true,
      };
    }

    case types.HIDE_MODAL: {
      return {
        ...state,
        isDisplayedModal: false,
      };
    }

    case types.SET_MODAL_DISPLAY: {
      return {
        ...state,
        modalDisplay: action.payload,
      };
    }

    default:
      return state;
  }
};

export default uiReducer;
