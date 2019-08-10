import { ipcRenderer } from 'electron';
import * as types from './actionTypes';
import ReqResCtrl from '../controllers/reqResController';

// BUSINESS LOGIC ACTIONS
export const getHistory = history => ({
  type: types.GET_HISTORY,
  payload: history,
});

export const deleteFromHistory = reqRes => ({
  type: types.DELETE_HISTORY,
  payload: reqRes,
});

export const getCollections = collections => ({
  type: types.GET_COLLECTIONS,
  payload: collections,
});

export const deleteFromCollection = collection => ({
  type: types.DELETE_COLLECTION,
  payload: collection,
});

export const collectionToReqRes = reqResArray => ({
  type: types.COLLECTION_TO_REQRES,
  payload: reqResArray,
});

export const reqResClear = () => ({
  type: types.REQRES_CLEAR,
});

export const reqResAdd = reqRes => ({
  type: types.REQRES_ADD,
  payload: reqRes,
});

export const reqResDelete = reqRes => ({
  type: types.REQRES_DELETE,
  payload: reqRes,
});

export const reqResUpdate = reqRes => ({
  type: types.REQRES_UPDATE,
  payload: reqRes,
});

export const setComposerWarningMessage = message => ({
  type: types.SET_COMPOSER_WARNING_MESSAGE,
  payload: message,
});


export const setNewRequestFields = (requestObj) => ({
  type: types.SET_NEW_REQUEST_FIELDS,
  payload : requestObj
});

export const setNewRequestHeaders = (headers) => ({
  type: types.SET_NEW_REQUEST_HEADERS,
  payload : headers
});

export const setNewRequestBody = (body) => ({
  type: types.SET_NEW_REQUEST_BODY,
  payload : body
});

export const setNewRequestCookies = (cookies) => ({
  type: types.SET_NEW_REQUEST_COOKIES,
  payload : cookies
});

export const setCurrentTab = (tab) => ({
  type: types.SET_CURRENT_TAB,
  payload: tab,
});

export const setChecksAndMinis = (reqResArray) => ({
  type: types.SET_CHECKS_AND_MINIS,
  payload: reqResArray,
});

// UI ACTIONS
export const showWarning = () => ({
  type: types.SHOW_WARNING,
});

export const hideWarning = () => ({
  type: types.HIDE_WARNING,
});

export const setComposerDisplay = composerDisplay => ({
  type: types.SET_COMPOSER_DISPLAY,
  payload: composerDisplay,
});
