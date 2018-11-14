import * as types from '../actions/actionTypes';


const initialState = { 
  isDisplayedModal : false,
};

const uiReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.SHOW_MODAL:{
      console.log('action',action);
      return {
        ...state,
        isDisplayedModal : true,
      }
    }

    case types.HIDE_MODAL:{
      console.log('action',action);
      return {
        ...state,
        isDisplayedModal : false,
      }
    }

    default:
      return state;
  }
};

export default uiReducer;