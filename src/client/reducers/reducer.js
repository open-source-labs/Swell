import * as types from '../actions/actionTypes';


const initialState = {
 
};

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case types.UPDATE_STATE_IMAGES:{
      console.log('action',action);
      return {
        ...state,
        
      }
    }
    default:
      return state;
  }
};

export default reducer;