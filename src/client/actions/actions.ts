import { string } from 'prop-types';
import { NewRequestResponseObject } from '../../types';
import * as types from './actionTypes';
import * as interfaces from '../../types';

// BUSINESS LOGIC ACTIONS

// action creators
// SPNOTE START line 11 types.ts history: Record<string, unknown>[];
export const getHistory = (history: string[]): {type: string, payload: string[]} => ({
  type: types.GET_HISTORY,
  payload: history
});


export const deleteFromHistory = (reqRes: string): {type: string, payload: string} => ({
  type: types.DELETE_HISTORY,
  payload: reqRes
});

export const clearHistory = (): {type: string} => ({
  type: types.CLEAR_HISTORY,
});

// SPNOTE line 11 types.ts collections: Record<string, unknown>[];
export const getCollections = (collections: string[]): {type: string, payload: string[]} => ({
  type: types.GET_COLLECTIONS,
  payload: collections
});

export const deleteFromCollection = (collection: string): {type: string, payload: string} => ({
  type: types.DELETE_COLLECTION,
  payload: collection
});

// SPNOTE line 9 types.ts reqResArray: NewRequestResponseObject[];
export const collectionToReqRes = (reqResArray: NewRequestResponseObject[]): {type: string, payload: NewRequestResponseObject[]}  => ({
  type: types.COLLECTION_TO_REQRES,
  payload: reqResArray
});

export const collectionAdd = (collection: string): {type: string, payload: string} => ({
  type: types.COLLECTION_ADD,
  payload: collection
});

export const collectionUpdate = (collection: string): {type: string, payload: string} => ({
  type: types.COLLECTION_UPDATE,
  payload: collection
});

export const reqResClear = (): {type: string} => ({
  type: types.REQRES_CLEAR,
});

export const reqResAdd = (reqRes: NewRequestResponseObject): {type: string, payload: NewRequestResponseObject} => ({
  type: types.REQRES_ADD,
  payload: reqRes
});

export const reqResDelete = (reqRes: NewRequestResponseObject): {type: string, payload: NewRequestResponseObject} => ({
  type: types.REQRES_DELETE,
  payload: reqRes
});

export const reqResUpdate = (reqRes: NewRequestResponseObject): {type: string, payload: NewRequestResponseObject} => ({
  type: types.REQRES_UPDATE,
  payload: reqRes
});

//reqRes payload type initially assigned to a boolean
export const scheduledReqResUpdate = (reqRes: NewRequestResponseObject): {type: string, payload: NewRequestResponseObject} => ({
  type: types.SCHEDULED_REQRES_UPDATE,
  payload: reqRes
});

export const scheduledReqResDelete = (): {type: string} => ({
  type: types.SCHEDULED_REQRES_DELETE,
});

export const updateGraph = (id: number): {type: string, payload: number} => ({
  type: types.UPDATE_GRAPH,
  payload: id
});

export const clearGraph = (reqRes: Record<string, number>): {type: string, payload: Record<string, number>} => ({
  type: types.CLEAR_GRAPH,
  payload: reqRes
});

export const clearAllGraph = (): {type: string} => ({
  type: types.CLEAR_ALL_GRAPH,
});

export const setComposerWarningMessage = (message: Record<string, string>): {type: string, payload: Record<string, string>} => ({
  type: types.SET_COMPOSER_WARNING_MESSAGE,
  payload: message
});

export const resetComposerFields = (): {type: string} => ({
  type: types.RESET_COMPOSER_FIELDS,
});

export const setNewRequestFields = (requestObj: Record<string, unknown>): {type: string, payload: Record<string, unknown>} => ({
  type: types.SET_NEW_REQUEST_FIELDS,
  payload: requestObj
});

// GIGI START HERE
// gigi - because of line 164 in History.jsx
export const setNewRequestHeaders = (headers: string[]): {type: string, payload: string[]} => ({
  type: types.SET_NEW_REQUEST_HEADERS,
  payload: headers
});

// gigi - SingleReqResContainer line 172 & History.jsx 189
export const setNewRequestStreams = (streams: Record<string, unknown>): {type: string, payload: Record<string, unknown>} => ({
  type: types.SET_NEW_REQUEST_STREAMS,
  payload: streams
});

// gigi - history line 171 & singlereqrescontainer line 149
export const setNewRequestBody = (body: string): {type: string, payload: string} => ({
  type: types.SET_NEW_REQUEST_BODY,
  payload: body
});

// gigi - because of line 84 in types.ts //testContent in bussiness.ts
export const setNewTestContent = (content: string): {type: string, payload: string} => ({
  type: types.SET_NEW_TEST_CONTENT,
  payload: content
});


export const setNewRequestCookies = (cookies: string[]): {type: string, payload: string[]} => ({
  type: types.SET_NEW_REQUEST_COOKIES,
  payload: cookies // jNote - no breakage, but cookies don't seem to work correctly
});

export const setNewRequestSSE = (SSEBool: boolean): {type: string, payload: boolean} => ({
  type: types.SET_NEW_REQUEST_SSE,
  payload: SSEBool
});

// jNote - setCurrentTab below not used??

// // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
// export const setCurrentTab = (tab: $TSFixMe) => ({
//   type: types.SET_CURRENT_TAB,
//   payload: tab
// });

export const setChecksAndMinis = (reqResArray: string[]): {type: string, payload: string[]} => ({
  type: types.SET_CHECKS_AND_MINIS,
  payload: reqResArray
}); //

export const setIntrospectionData = (dataObj: Record<string, unknown>): {type: string, payload: Record<string, unknown>} => ({
  type: types.SET_INTROSPECTION_DATA,
  payload: dataObj
});

// There is a second parameter (of varying type: string or object) that is sometimes passed to this function
export const saveCurrentResponseData = (dataObj: Record<string, unknown>, secondParam: string | Record<string, unknown>): {type: string, payload: Record<string, unknown>} => ({
  type: types.SAVE_CURRENT_RESPONSE_DATA,
  payload: dataObj,
});

// UI ACTIONS ** 

//check to make sure this didn't mess with any functionality
// // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
// export const setComposerDisplay = (composerDisplay: Record<string, unknown>): {type: string, payload: Record<string, unknown>} => ({
//   type: types.SET_COMPOSER_DISPLAY,
//   payload: composerDisplay
// });


export const setSidebarActiveTab = (tabName: string): {type: string, payload: string} => ({
  type: types.SET_SIDEBAR_ACTIVE_TAB,
  payload: tabName
});


export const setWorkspaceActiveTab = (tabName: string): {type: string, payload: string} => ({
  type: types.SET_WORKSPACE_ACTIVE_TAB,
  payload: tabName
});


export const setResponsePaneActiveTab = (tabName: string): {type: string, payload: string} => ({
  type: types.SET_RESPONSE_PANE_ACTIVE_TAB,
  payload: tabName
});

// jNote: 1st $TSFixMe
export const toggleDarkMode = (isDark: boolean): {type: string, payload: boolean} => ({
  type: types.TOGGLE_DARK_MODE,
  payload: isDark
})

// OPENAPI ACTIONS
//Jay Start`
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
