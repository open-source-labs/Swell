import * as types from '../actions/actionTypes';
import db from '../db';
import dbController from '../controllers/dbController';


const initialState = { 
  currentTab : 'First Tab',
  reqResArray : [],
  history : [],
  warningModalMessage : "",
  newResponseFields : {},
};

const businessReducer = (state=initialState, action) => {
  switch(action.type) {

    case types.GET_HISTORY:{
      console.log('action',action);

      let history = action.payload;

      return {
        ...state,
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
        reqResArray : [],
        history
      }
    }

    case types.DELETE_HISTORY:{
      console.log('action',action);

      let deleteId = action.payload.id;

      return {
        ...state,
        history: state.history.filter(history => {
          return history.id !== deleteId;
        }),
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
        reqResArray : JSON.parse(JSON.stringify(state.reqResArray))
      }
    }

    case types.REQRES_CLEAR:{
      console.log('action',action);
      return {
        ...state,
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
        reqResArray : [],
      }
    }

    case types.REQRES_ADD:{
      console.log('action',action);

      let reqResArray = JSON.parse(JSON.stringify(state.reqResArray));
      reqResArray.push(action.payload);
      let history = JSON.parse(JSON.stringify(state.history));
      history.push(action.payload);

      return {
        ...state,
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
        reqResArray,
        history
      }
    }

    case types.REQRES_DELETE:{
      console.log('action',action);

      let deleteId = action.payload.id;

      return {
        ...state,
        history : JSON.parse(JSON.stringify(state.history)),
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
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
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
        reqResArray : reqResDeepCopy,
        history : JSON.parse(JSON.stringify(state.history)),
      }
    }

    case types.SET_WARNING_MODAL_MESSAGE:{
      console.log('action',action);
      return {
        ...state,
        history : JSON.parse(JSON.stringify(state.history)),
        reqResArray : JSON.parse(JSON.stringify(state.reqResArray)),
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
        warningModalMessage : action.payload
      }
    }

    case types.SET_NEW_RESPONSE_FIELDS:{
      // console.log('action',action);
      return {
        ...state,
        history : JSON.parse(JSON.stringify(state.history)),
        reqResArray : JSON.parse(JSON.stringify(state.reqResArray)),
        newResponseFields : JSON.parse(JSON.stringify(action.payload)),
      }
    }

    case types.SET_CURRENT_TAB:{
      console.log('action',action);
      return {
        ...state,
        history : JSON.parse(JSON.stringify(state.history)),
        reqResArray : JSON.parse(JSON.stringify(state.reqResArray)),
        newResponseFields : JSON.parse(JSON.stringify(state.newResponseFields)),
        currentTab : action.payload,
      }
    }
    

    default:
      return state;
  }
};

export default businessReducer;