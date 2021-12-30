import * as types from './actionTypes';

// BUSINESS LOGIC ACTIONS

// action creators
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getHistory = (history: $TSFixMe) => ({
  type: types.GET_HISTORY,
  payload: history
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const deleteFromHistory = (reqRes: $TSFixMe) => ({
  type: types.DELETE_HISTORY,
  payload: reqRes
});

export const clearHistory = () => ({
  type: types.CLEAR_HISTORY,
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getCollections = (collections: $TSFixMe) => ({
  type: types.GET_COLLECTIONS,
  payload: collections
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const deleteFromCollection = (collection: $TSFixMe) => ({
  type: types.DELETE_COLLECTION,
  payload: collection
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const collectionToReqRes = (reqResArray: $TSFixMe) => ({
  type: types.COLLECTION_TO_REQRES,
  payload: reqResArray
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const collectionAdd = (collection: $TSFixMe) => ({
  type: types.COLLECTION_ADD,
  payload: collection
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const collectionUpdate = (collection: $TSFixMe) => ({
  type: types.COLLECTION_UPDATE,
  payload: collection
});

export const reqResClear = () => ({
  type: types.REQRES_CLEAR,
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const reqResAdd = (reqRes: $TSFixMe) => ({
  type: types.REQRES_ADD,
  payload: reqRes
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const reqResDelete = (reqRes: $TSFixMe) => ({
  type: types.REQRES_DELETE,
  payload: reqRes
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const reqResUpdate = (reqRes: $TSFixMe) => ({
  type: types.REQRES_UPDATE,
  payload: reqRes
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const scheduledReqResUpdate = (reqRes: $TSFixMe) => ({
  type: types.SCHEDULED_REQRES_UPDATE,
  payload: reqRes
});

export const scheduledReqResDelete = () => ({
  type: types.SCHEDULED_REQRES_DELETE,
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const updateGraph = (id: $TSFixMe) => ({
  type: types.UPDATE_GRAPH,
  payload: id
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const clearGraph = (reqRes: $TSFixMe) => ({
  type: types.CLEAR_GRAPH,
  payload: reqRes
});

export const clearAllGraph = () => ({
  type: types.CLEAR_ALL_GRAPH,
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setComposerWarningMessage = (message: $TSFixMe) => ({
  type: types.SET_COMPOSER_WARNING_MESSAGE,
  payload: message
});

export const resetComposerFields = () => ({
  type: types.RESET_COMPOSER_FIELDS,
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setNewRequestFields = (requestObj: $TSFixMe) => ({
  type: types.SET_NEW_REQUEST_FIELDS,
  payload: requestObj
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setNewRequestHeaders = (headers: $TSFixMe) => ({
  type: types.SET_NEW_REQUEST_HEADERS,
  payload: headers
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setNewRequestStreams = (streams: $TSFixMe) => ({
  type: types.SET_NEW_REQUEST_STREAMS,
  payload: streams
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setNewRequestBody = (body: $TSFixMe) => ({
  type: types.SET_NEW_REQUEST_BODY,
  payload: body
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setNewTestContent = (content: $TSFixMe) => ({
  type: types.SET_NEW_TEST_CONTENT,
  payload: content
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setNewRequestCookies = (cookies: $TSFixMe) => ({
  type: types.SET_NEW_REQUEST_COOKIES,
  payload: cookies
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setNewRequestSSE = (SSEBool: $TSFixMe) => ({
  type: types.SET_NEW_REQUEST_SSE,
  payload: SSEBool
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setCurrentTab = (tab: $TSFixMe) => ({
  type: types.SET_CURRENT_TAB,
  payload: tab
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setChecksAndMinis = (reqResArray: $TSFixMe) => ({
  type: types.SET_CHECKS_AND_MINIS,
  payload: reqResArray
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setIntrospectionData = (dataObj: $TSFixMe) => ({
  type: types.SET_INTROSPECTION_DATA,
  payload: dataObj
});

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'dataObj' implicitly has an 'any' type.
export const saveCurrentResponseData = (dataObj, callingFunc) => ({
  type: types.SAVE_CURRENT_RESPONSE_DATA,
  payload: dataObj,
  callingFunc
});

// UI ACTIONS

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setComposerDisplay = (composerDisplay: $TSFixMe) => ({
  type: types.SET_COMPOSER_DISPLAY,
  payload: composerDisplay
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setSidebarActiveTab = (tabName: $TSFixMe) => ({
  type: types.SET_SIDEBAR_ACTIVE_TAB,
  payload: tabName
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setWorkspaceActiveTab = (tabName: $TSFixMe) => ({
  type: types.SET_WORKSPACE_ACTIVE_TAB,
  payload: tabName
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setResponsePaneActiveTab = (tabName: $TSFixMe) => ({
  type: types.SET_RESPONSE_PANE_ACTIVE_TAB,
  payload: tabName
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const toggleDarkMode = (isDark: $TSFixMe) => ({
  type: types.TOGGLE_DARK_MODE,
  payload: isDark
})

// OPENAPI ACTIONS

export const setNewRequestsOpenAPI = ({
  openapiMetadata,
  openapiReqArray
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
}: $TSFixMe) => ({
  type: types.SET_NEW_REQUESTS_OPENAPI,
  payload: { openapiMetadata, openapiReqArray },
});
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const setOpenAPIServersGlobal = (serverIds: $TSFixMe) => ({
  type: types.SET_OPENAPI_SERVERS_GLOBAL,
  payload: serverIds
});
// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'requestId' implicitly has an 'any' type... Remove this comment to see the full error message
export const setOpenAPIServers = (requestId, serverIds) => ({
  type: types.SET_NEW_OPENAPI_SERVERS,
  payload: { id: requestId, serverIds }
});
// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'requestId' implicitly has an 'any' type... Remove this comment to see the full error message
export const setOpenAPIParameter = (requestId, location, name, value) => ({
  type: types.SET_NEW_OPENAPI_PARAMETER,
  payload: { id: requestId, location, name, value }
});
// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'requestId' implicitly has an 'any' type... Remove this comment to see the full error message
export const setOpenAPIRequestBody = (requestId, mediaType, requestBody) => ({
  type: types.SET_NEW_OPENAPI_REQUEST_BODY,
  payload: { id: requestId, mediaType, requestBody }
});
export const queueOpenAPIRequests = () => ({
  type: types.QUEUE_OPENAPI_REQUESTS,
});
