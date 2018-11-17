import * as types from '../actions/actionTypes';


const initialState = { 
  reqResArray : [],
  warningModalMessage : "",
};

const businessReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.REQRES_CLEAR:{
      console.log('action',action);
      return {
        ...state,
        reqResArray : [],
      }
    }

    case types.REQRES_ADD:{
      console.log('action',action);

      let reqResArray = JSON.parse(JSON.stringify(state.reqResArray));
      reqResArray.push(action.payload);

      return {
        ...state,
        reqResArray
      }
    }

    case types.REQRES_DELETE:{
      console.log('action',action);

      let deleteId = action.payload.id;

      return {
        ...state,
        reqResArray : state.reqResArray.filter(reqRes => {
          return reqRes.id !== deleteId;
        })
      }
    }

    case types.REQRES_UPDATE:{
      console.log('action',action);

      let reqResDeepCopy = JSON.parse(JSON.stringify(state.reqResArray));

      let indexToBeUpdated = undefined;
      reqResDeepCopy.forEach((reqRes, index) => {
        if(reqRes.id === action.payload.id) {
          indexToBeUpdated = index;
        }
      });

      if (indexToBeUpdated !== undefined) {
        reqResDeepCopy.splice(indexToBeUpdated, 1, JSON.parse(JSON.stringify(action.payload)));
      }

      return {
        ...state,
        reqResArray : reqResDeepCopy,
      }
    }

    case types.SET_WARNING_MODAL_MESSAGE:{
      console.log('action',action);

      return {
        ...state,
        reqResArray : JSON.parse(JSON.stringify(state.reqResArray)),
        warningModalMessage : action.payload
      }
    }

    default:
      return state;
  }
};

export default businessReducer;