import * as types from '../actions/actionTypes';
import db from '../db';
import dbController from '../controllers/dbController';

const initialState = {
  currentTab: 'First Tab',
  reqResArray: [],
  history: [],
  warningModalMessage: '',
  newResponseFields: {},
  newRequestHeaders: {
    headersArr: [],
    count: 0,
  },
  newRequestBody: {
    bodyContent: '',
    bodyType: 'none',
    rawType: 'Text (text/plain)',
    JSONFormatted: true,
  },
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_HISTORY: {
      console.log('action', action);

      return {
        ...state,
        reqResArray: [],
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        history: action.payload,
      };
    }

    case types.DELETE_HISTORY: {
      console.log('action', action);

      const deleteId = action.payload.id;
      const deleteDate = JSON.stringify(action.payload.created_at)
        .split('T')[0]
        .substr(1);
      const newHistory = JSON.parse(JSON.stringify(state.history));
      newHistory.forEach((obj) => {
        if (obj.date === deleteDate) obj.history = obj.history.filter(hist => hist.id !== deleteId);
      });

      return {
        ...state,
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),
        reqResArray: JSON.parse(JSON.stringify(state.reqResArray)),

        history: newHistory,
      };
    }

    case types.REQRES_CLEAR: {
      console.log('action', action);
      return {
        ...state,
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        reqResArray: [],
      };
    }

    case types.REQRES_ADD: {
      console.log('action', action);

      const reqResArray = JSON.parse(JSON.stringify(state.reqResArray));
      reqResArray.push(action.payload);
      const addDate = JSON.stringify(action.payload.created_at)
        .split('T')[0]
        .substr(1);
      const newHistory = JSON.parse(JSON.stringify(state.history));
      newHistory.forEach((obj) => {
        if (obj.date === addDate) obj.history.unshift(action.payload);
      });

      return {
        ...state,
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        reqResArray,
        history: newHistory,
      };
    }

    case types.REQRES_DELETE: {
      console.log('action', action);

      const deleteId = action.payload.id;

      return {
        ...state,
        history: JSON.parse(JSON.stringify(state.history)),
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        reqResArray: state.reqResArray.filter(reqRes => reqRes.id !== deleteId),
      };
    }

    case types.REQRES_UPDATE: {
      console.log('action', action);
      const reqResDeepCopy = JSON.parse(JSON.stringify(state.reqResArray));

      let indexToBeUpdated;
      reqResDeepCopy.forEach((reqRes, index) => {
        if (reqRes.id === action.payload.id) {
          indexToBeUpdated = index;
        }
      });

      if (indexToBeUpdated !== undefined) {
        reqResDeepCopy.splice(indexToBeUpdated, 1, JSON.parse(JSON.stringify(action.payload)));
      }

      return {
        ...state,
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),
        history: JSON.parse(JSON.stringify(state.history)),

        reqResArray: reqResDeepCopy,
      };
    }

    case types.SET_WARNING_MODAL_MESSAGE: {
      console.log('action', action);
      return {
        ...state,
        history: JSON.parse(JSON.stringify(state.history)),
        reqResArray: JSON.parse(JSON.stringify(state.reqResArray)),
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        warningModalMessage: action.payload,
      };
    }

    case types.SET_NEW_RESPONSE_FIELDS: {
      console.log('action', action);
      return {
        ...state,
        history: JSON.parse(JSON.stringify(state.history)),
        reqResArray: JSON.parse(JSON.stringify(state.reqResArray)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        newResponseFields: JSON.parse(JSON.stringify(action.payload)),
      };
    }

    case types.SET_NEW_REQUEST_HEADERS: {
      console.log('action', action);
      return {
        ...state,
        history: JSON.parse(JSON.stringify(state.history)),
        reqResArray: JSON.parse(JSON.stringify(state.reqResArray)),
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        newRequestHeaders: JSON.parse(JSON.stringify(action.payload)),
      };
    }

    case types.SET_NEW_REQUEST_BODY: {
      console.log('action', action);

      return {
        ...state,
        history: JSON.parse(JSON.stringify(state.history)),
        reqResArray: JSON.parse(JSON.stringify(state.reqResArray)),
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),

        newRequestBody: JSON.parse(JSON.stringify(action.payload)),
      };
    }

    case types.SET_CURRENT_TAB: {
      console.log('action', action);
      return {
        ...state,
        history: JSON.parse(JSON.stringify(state.history)),
        reqResArray: JSON.parse(JSON.stringify(state.reqResArray)),
        newResponseFields: JSON.parse(JSON.stringify(state.newResponseFields)),
        newRequestHeaders: JSON.parse(JSON.stringify(state.newRequestHeaders)),
        newRequestBody: JSON.parse(JSON.stringify(state.newRequestBody)),

        currentTab: action.payload,
      };
    }

    default:
      return state;
  }
};

export default businessReducer;
