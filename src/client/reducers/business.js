import format from 'date-fns/format';
import * as types from '../actions/actionTypes';
// import db from '../db';
// import dbController from '../controllers/dbController';


const initialState = { 
  currentTab : 'First Tab',
  reqResArray : [],
  history : [],
  warningModalMessage : "",
  newRequestFields : {
    method : 'GET',
    protocol : 'http://',
    url : 'http://',
  },
  newRequestHeaders : {
    headersArr : [],
    count : 0,
  },
  newRequestCookies : {
    cookiesArr : [],
    count : 0,
  },
  newRequestBody : {
    bodyContent : '',
    bodyType : 'none',
    rawType : 'Text (text/plain)',
    JSONFormatted : true,
  },
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_HISTORY: {
      console.log('action', action);

      return {
        ...state,

        reqResArray : [],
        history: action.payload,
      };
    }

    case types.DELETE_HISTORY: {
      console.log('action', action);

      const deleteId = action.payload.id;
      const deleteDate = format(action.payload.created_at, 'MM/DD/YYYY');
      const newHistory = JSON.parse(JSON.stringify(state.history));
      newHistory.forEach((obj, i) => {
        if (obj.date === deleteDate)
          obj.history = obj.history.filter(hist => hist.id !== deleteId);
          if (obj.history.length === 0) {
            newHistory.splice(i, 1) 
          }
      })

      return {
        ...state,
        history: newHistory,
      };
    }

    case types.REQRES_CLEAR: {
      console.log('action', action);
      return {
        ...state,
        reqResArray: [],
      };
    }

    case types.REQRES_ADD: {
      console.log('action', action);

      const reqResArray = JSON.parse(JSON.stringify(state.reqResArray));
      reqResArray.push(action.payload);

      const addDate = format(action.payload.created_at, 'MM/DD/YYYY');

      const newHistory = JSON.parse(JSON.stringify(state.history));
      
      let updated = false;
      newHistory.forEach((obj) => {
        if (obj.date === addDate) {
          obj.history.unshift(action.payload);
          updated = true;
        }
      });
      if (!updated) {
        newHistory.unshift({
          date: addDate,
          history: [action.payload],
        });
      }

      return {
        ...state,
        reqResArray,
        history: newHistory,
      };
    }

    case types.REQRES_DELETE: {
      console.log('action', action);

      const deleteId = action.payload.id;

      return {
        ...state,
        reqResArray : state.reqResArray.filter(reqRes => {
          return reqRes.id !== deleteId;
        })
      }
    }

    case types.REQRES_UPDATE:{
      console.log('action',action);
      console.log('action payload', action.payload)
      let reqResDeepCopy = JSON.parse(JSON.stringify(state.reqResArray));

      let indexToBeUpdated;
      reqResDeepCopy.forEach((reqRes, index) => {
        if (reqRes.id === action.payload.id) {
          indexToBeUpdated = index;
        }
      });

      if (indexToBeUpdated !== undefined) {
        reqResDeepCopy.splice(indexToBeUpdated, 1, action.payload);
      }

      return {
        ...state,
        reqResArray: reqResDeepCopy,
      };
    }

    case types.SET_WARNING_MODAL_MESSAGE: {
      console.log('action', action);
      return {
        ...state,
        warningModalMessage : action.payload
      }
    }

    case types.SET_NEW_REQUEST_FIELDS:{
      // console.log('action',action);
      return {
        ...state,
        newRequestFields : action.payload,
      }
    }

    case types.SET_NEW_REQUEST_HEADERS: {
      console.log('action', action);
      return {
        ...state,
        newRequestHeaders: action.payload,
      };
    }

    case types.SET_NEW_REQUEST_BODY: {
      console.log('action', action);

      return {
        ...state,
        newRequestBody: action.payload,
      };
    }

    case types.SET_NEW_REQUEST_COOKIES: {
      console.log('action', action);

      return {
        ...state,
        newRequestCookies: action.payload,
      };
    }

    case types.SET_CURRENT_TAB: {
      console.log('action', action);
      return {
        ...state,
        currentTab : action.payload,
      }
    }

    default:
      return state;
  }
};

export default businessReducer;
