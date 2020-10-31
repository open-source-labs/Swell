import * as types from "./actionTypes";

// BUSINESS LOGIC ACTIONS
export const getHistory = (history) => ({
  type: types.GET_HISTORY,
  payload: history,
});

export const deleteFromHistory = (reqRes) => ({
  type: types.DELETE_HISTORY,
  payload: reqRes,
});

export const clearHistory = () => ({
  type: types.CLEAR_HISTORY,
});

export const getCollections = (collections) => ({
  type: types.GET_COLLECTIONS,
  payload: collections,
});

export const deleteFromCollection = (collection) => ({
  type: types.DELETE_COLLECTION,
  payload: collection,
});

export const collectionToReqRes = (reqResArray) => ({
  type: types.COLLECTION_TO_REQRES,
  payload: reqResArray,
});

export const collectionAdd = (collection) => ({
  type: types.COLLECTION_ADD,
  payload: collection,
});

export const reqResClear = () => ({
  type: types.REQRES_CLEAR,
});

export const reqResAdd = (reqRes) => ({
  type: types.REQRES_ADD,
  payload: reqRes,
});

export const reqResDelete = (reqRes) => ({
  type: types.REQRES_DELETE,
  payload: reqRes,
});

export const reqResUpdate = (reqRes) => ({
  type: types.REQRES_UPDATE,
  payload: reqRes,
});

export const updateGraph = (reqRes) => ({
  type: types.UPDATE_GRAPH,
  payload: reqRes,
});

export const clearGraph = () => ({
  type: types.CLEAR_GRAPH,
});

export const setComposerWarningMessage = (message) => ({
  type: types.SET_COMPOSER_WARNING_MESSAGE,
  payload: message,
});

export const resetComposerFields = () => ({
  type: types.RESET_COMPOSER_FIELDS
});


export const setNewRequestFields = (requestObj) => ({
  type: types.SET_NEW_REQUEST_FIELDS,
  payload: requestObj,
});

export const setNewRequestHeaders = (headers) => ({
  type: types.SET_NEW_REQUEST_HEADERS,
  payload: headers,
});

export const setNewRequestStreams = (streams) => ({
  type: types.SET_NEW_REQUEST_STREAMS,
  payload: streams,
});

export const setNewRequestBody = (body) => ({
  type: types.SET_NEW_REQUEST_BODY,
  payload: body,
});

export const setNewRequestCookies = (cookies) => ({
  type: types.SET_NEW_REQUEST_COOKIES,
  payload: cookies,
});

export const setNewRequestSSE = (SSEBool) => ({
  type: types.SET_NEW_REQUEST_SSE,
  payload: SSEBool,
});

export const setCurrentTab = (tab) => ({
  type: types.SET_CURRENT_TAB,
  payload: tab,
});

export const setChecksAndMinis = (reqResArray) => ({
  type: types.SET_CHECKS_AND_MINIS,
  payload: reqResArray,
});

export const setIntrospectionData = (dataObj) => ({
  type: types.SET_INTROSPECTION_DATA,
  payload: dataObj,
});

export const saveCurrentResponseData = (dataObj) => ({
  type: types.SAVE_CURRENT_RESPONSE_DATA,
  payload: dataObj,
});

// UI ACTIONS

export const setComposerDisplay = (composerDisplay) => ({
  type: types.SET_COMPOSER_DISPLAY,
  payload: composerDisplay,
});

export const setSidebarActiveTab = (tabName) => ({
  type: types.SET_SIDEBAR_ACTIVE_TAB,
  payload: tabName,
});

export const setWorkspaceActiveTab = (tabName) => ({
  type: types.SET_WORKSPACE_ACTIVE_TAB,
  payload: tabName,
});
