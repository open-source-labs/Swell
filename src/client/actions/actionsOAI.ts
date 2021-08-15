import * as types from './actionTypes';

export interface action {
  type: string,
  payload?: unknown,
}

export const importOAIDocument = (document: string): action => ({
  type: types.IMPORT_OAI_DOCUMENT,
  payload: document,
});
export const enableAllOAI = (): action => ({
  type: types.ENABLE_ALL_OAI,
});
export const disableAllOAI = (): action => ({
  type: types.DISABLE_ALL_OAI,
});
export const enableAllTagOAI = (tag: string): action => ({
  type: types.ENABLE_ALL_OAI_TAG_OAI,
  payload: tag,
});
export const disableAllTagOAI = (tag: string): action => ({
  type: types.DISABLE_ALL_TAG_OAI,
  payload: tag,
});
export const enableOAIRequest = (requestId: number): action => ({
  type: types.ENABLE_OAI_REQUEST,
  payload: requestId,
});
export const disableOAIRequest = (requestId: number): action => ({
  type: types.DISABLE_REQUEST_OAI,
  payload: requestId,
});
export const setOAIServersGlobal = (serverIds: number[]): action => ({
  type: types.SET_OAI_SERVERS_GLOBAL,
  payload: serverIds,
});
export const setOAIServers = (requestId: number, serverIds: number[]): action => ({
  type: types.SET_OAI_SERVERS,
  payload: {id: requestId, serverIds},
});
export const addOAIParameter = (requestId: number): action => ({
  type: types.ADD_NEW_OAI_PARAMETER,
  payload: requestId,
});
export const setOAIParameter = (requestId: number, type: string, key: string, value: string): action => ({
  type: types.SET_NEW_OAI_PARAMETER,
  payload: {id: requestId, type, key, value},
});
export const setOAIRequestBody = (requestId: number, mediaType: string, requestBody: unknown): action => ({
  type: types.SET_NEW_OAI_REQUEST_BODY,
  payload: {id: requestId, mediaType, requestBody},
});
export const sendOAIRequests = (): action => ({
  type: types.SEND_OAI_REQUESTS,
});
