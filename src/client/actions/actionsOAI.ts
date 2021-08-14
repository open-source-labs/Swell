import * as types from './actionTypesOAI';

export const importOAIDocument = (document: String) => ({
  type: types.IMPORT_OAI_DOCUMENT,
  payload: document,
});
export const enableAllOAI = () => ({
  type: types.ENABLE_ALL_OAI,
});
export const disableAllOAI = () => ({
  type: types.DISABLE_ALL_OAI,
});
export const enableAllTagOAI = (tag: string) => ({
  type: types.ENABLE_ALL_OAI_TAG_OAI,
  payload: tag,
});
export const disableAllTagOAI = (tag: string) => ({
  type: types.DISABLE_ALL_TAG_OAI,
  payload: tag,
});
export const enableOAIRequest = (requestId: number) => ({
  type: types.ENABLE_OAI_REQUEST,
  payload: requestId,
});
export const disableOAIRequest = (requestId: number) => ({
  type: types.DISABLE_REQUEST_OAI,
  payload: requestId,
});
export const setOAIServersAll = (servers: string[]) => ({
  type: types.SET_OAI_SERVERS_ALL,
  payload: servers,
});
export const setOAIServers = (requestId: number, servers: string[]) => ({
  type: types.SET_OAI_SERVERS,
  payload: {id: requestId, servers},
});
export const setOAIParameter = (requestId: number, type: string, key: string, value: string) => ({
  type: types.SET_OAI_PARAMETER,
  payload: {id: requestId, type, key, value},
});
export const addOAIParameter = (requestId: number) => ({
  type: types.ADD_NEW_OAI_PARAMETER,
  payload: requestId,
});
export const setOAIRequestBody = (requestId: number, requestBody: string) => ({
  type: types.SET_NEW_OAI_REQUEST_BODY,
  payload: {id: requestId, requestBody},
});
export const sendOAIRequests = (reqResArray: Object[]) => ({
  type: types.SEND_OAI_REQUESTS,
  payload: reqResArray,
});
