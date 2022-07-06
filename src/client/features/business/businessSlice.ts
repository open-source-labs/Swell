// import { format } from 'date-fns';
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { ReqRes, Collection } from '../../../types';

// // ********************************
// // * The Redux store is setup in modern Redux Toolkit style
// // * https://redux-toolkit.js.org/
// // * TODO: should State be in type file?
// // ********************************

// interface State {
//   currentTab: string;
//   reqResArray: ReqRes[];
//   scheduledReqResArray: ReqRes[];
//   history: Collection[];
//   collections: Collection[];
//   warningMessage: Record<string, unknown>;
//   newRequestsOpenAPI: {
//     openapiMetadata: {
//       info: Record<string, unknown>;
//       tags: [];
//       serverUrls: [];
//     };
//     openapiReqArray: [];
//   };
//   newRequestFields: {
//     protocol: string;
//     restUrl: string;
//     wsUrl: string;
//     gqlUrl: string;
//     grpcUrl: string;
//     webrtcUrl: string;
//     url: string;
//     method: string;
//     graphQL: boolean;
//     gRPC: boolean;
//     ws: boolean;
//     openapi: boolean;
//     webrtc: boolean;
//     webhook: boolean;
//     network: string;
//     testContent: string;
//     testResults: [];
//     openapiReqObj: Record<string, unknown>;
//   };
//   newRequestHeaders: {
//     headersArr: [];
//     count: number;
//   };
//   newRequestStreams: {
//     streamsArr: [];
//     count: number;
//     streamContent: [];
//     selectedPackage: null;
//     selectedRequest: null;
//     selectedService: null;
//     selectedServiceObj: null;
//     selectedStreamingType: null;
//     initialQuery: null;
//     queryArr: null;
//     protoPath: null;
//     services: null;
//     protoContent: string;
//   };
//   newRequestCookies: {
//     cookiesArr: [];
//     count: number;
//   };
//   newRequestBody: {
//     bodyContent: string;
//     bodyVariables: string;
//     bodyType: string;
//     rawType: string;
//     JSONFormatted: boolean;
//     bodyIsNew: boolean;
//   };
//   newRequestSSE: {
//     isSSE: boolean;
//   };
//   newRequestOpenAPIObject: {
//     request: {
//       id: number;
//       enabled: boolean;
//       reqTags: [];
//       reqServers: [];
//       summary: string;
//       description: string;
//       operationId: string;
//       method: string;
//       endpoint: string;
//       headers: Record<string, unknown>;
//       parameters: [];
//       body: Record<string, unknown>;
//       urls: [];
//     };
//   };
//   introspectionData: { schemaSDL: null; clientSchema: null };
//   graphPoints: Record<ReqRes['id'], GraphPoint[]>; //GraphPoint type defined in graphPointsSlice
//   currentResponse: {
//     request: {
//       network: string;
//     };
//     response: {
//       source: string;
//     };
//   };
// }

// const initialState: State = {
//   currentTab: 'First Tab',
//   reqResArray: [],
//   scheduledReqResArray: [],
//   history: [],
//   collections: [],
//   warningMessage: {},
//   newRequestsOpenAPI: {
//     openapiMetadata: {
//       info: {},
//       tags: [],
//       serverUrls: [],
//     },
//     openapiReqArray: [],
//   },
//   newRequestFields: {
//     protocol: '',
//     restUrl: 'http://',
//     wsUrl: 'ws://',
//     gqlUrl: 'https://',
//     grpcUrl: '',
//     webrtcUrl: '',
//     url: 'http://',
//     method: 'GET',
//     graphQL: false,
//     gRPC: false,
//     ws: false,
//     openapi: false,
//     webrtc: false,
//     webhook: false,
//     network: 'rest',
//     testContent: '',
//     testResults: [],
//     openapiReqObj: {},
//   },
//   newRequestHeaders: {
//     headersArr: [],
//     count: 0,
//   },
//   newRequestStreams: {
//     streamsArr: [],
//     count: 0,
//     streamContent: [],
//     selectedPackage: null,
//     selectedRequest: null,
//     selectedService: null,
//     selectedServiceObj: null,
//     selectedStreamingType: null,
//     initialQuery: null,
//     queryArr: null,
//     protoPath: null,
//     services: null,
//     protoContent: '',
//   },
//   newRequestCookies: {
//     cookiesArr: [],
//     count: 0,
//   },
//   newRequestBody: {
//     bodyContent: '',
//     bodyVariables: '',
//     bodyType: 'raw',
//     rawType: 'text/plain',
//     JSONFormatted: true,
//     bodyIsNew: false,
//   },
//   newRequestSSE: {
//     isSSE: false,
//   },
//   newRequestOpenAPIObject: {
//     request: {
//       id: 0,
//       enabled: true,
//       reqTags: [],
//       reqServers: [],
//       summary: '',
//       description: '',
//       operationId: '',
//       method: '',
//       endpoint: '',
//       headers: {},
//       parameters: [],
//       body: {},
//       urls: [],
//     },
//   },
//   introspectionData: { schemaSDL: null, clientSchema: null },
//   graphPoints: {},
//   currentResponse: {
//     request: {
//       network: '',
//     },
//     response: {
//       source: '',
//     },
//   },
// };

// const businessSlice = createSlice({
//   name: 'default',
//   initialState,
//   reducers: {
//     getHistory(state, action: PayloadAction<[]>) {
//       state.history = action.payload;
//     },

//     deleteFromHistory(state, action: PayloadAction<unknown>) {
//       const deleteId = action.payload.id;
//       const deleteDate = format(action.payload.createdAt, 'MM/dd/yyyy');
//       state.history.forEach((obj, i) => {
//         if (obj.date === deleteDate)
//           obj.history = obj.history.filter((hist) => hist.id !== deleteId);
//         if (obj.history.length === 0) {
//           state.history.splice(i, 1);
//         }
//       });
//     },

//     clearHistory(state) {
//       state.history = [];
//     },

//     getCollections(state, action: PayloadAction<Collection[]>) {
//       state.collections = action.payload;
//     },

//     deleteFromCollection(state, action: PayloadAction<Collection>) {
//       const deleteId = action.payload.id;
//       state.collections.forEach((obj, i) => {
//         if (obj.id === deleteId) {
//           state.collections.splice(i, 1);
//         }
//       });
//     },

//     resetComposerFields(state) {
//       (state.newRequestHeaders = { headersArr: [], count: 0 }),
//         (state.newRequestCookies = { cookiesArr: [], count: 0 }),
//         // should this clear every field or just protocol?
//         (state.newRequestFields = { ...state.newRequestFields, protocol: '' }),
//         (state.newRequestSSE = { isSSE: false }),
//         (state.warningMessage = {});
//       state.newRequestBody = {
//         bodyIsNew: state.newRequestBody.bodyIsNew, // why is this state saved?
//         bodyContent: '',
//         bodyVariables: '',
//         bodyType: 'raw',
//         rawType: 'text/plain',
//         JSONFormatted: true,
//       };
//     },

//     collectionToReqRes(state, action: PayloadAction<ReqRes[]>) {
//       state.reqResArray = action.payload;
//     },

//     collectionAdd(state, action: PayloadAction<Collection>) {
//       state.collections.push(action.payload);
//     },

//     collectionUpdate(state, action: PayloadAction<Collection>) {
//       const collectionName = action.payload.name;
//       state.collections.forEach((obj, i) => {
//         if (obj.name === collectionName) {
//           state.collections[i] = action.payload;
//         }
//       });
//     },

//     reqResClear(state) {
//       (state.reqResArray = []),
//         (state.currentResponse = { request: { network: '' } });
//     },

//     reqResItemAdded(state, action: PayloadAction<ReqRes>) {
//       state.reqResArray.push(action.payload);
//       const addDate = format(action.payload.createdAt, 'MM/dd/yyyy');
//       let updated = false;
//       state.history.forEach((obj) => {
//         if (obj.date === addDate) {
//           obj.history.unshift(action.payload);
//           updated = true;
//         }
//       });
//       // if there is not history at added date, create new history with new query
//       if (!updated) {
//         state.history.unshift({
//           date: addDate,
//           history: [action.payload],
//         });
//       }
//     },

//     reqResDelete(state, action: PayloadAction<ReqRes>) {
//       const deleteId = action.payload.id;
//       state.reqResArray = state.reqResArray.filter(
//         (reqRes) => reqRes.id !== deleteId
//       );
//     },

//     setChecksAndMinis(state, action: PayloadAction<ReqRes[]>) {
//       state.reqResArray = action.payload;
//     },

//     reqResUpdate(state, action: PayloadAction<ReqRes>) {
//       for (let i = 0; i < state.reqResArray.length; i++) {
//         if (state.reqResArray[i].id === action.payload.id) {
//           state.reqResArray[i] = {
//             ...action.payload,
//             checked: state.reqResArray[i].checked,
//             minimized: state.reqResArray[i].minimized,
//           };
//           break;
//         }
//       }
//     },

//     scheduledReqResUpdate(state, action: PayloadAction<ReqRes>) {
//       state.scheduledReqResArray.push(action.payload);
//     },

//     scheduledReqResDelete(state) {
//       state.scheduledReqResArray = [];
//     },

//     updateGraph(state, action: PayloadAction<ReqRes>) {
//       const { id } = action.payload; // latest reqRes object
//       // graphPoints to be used by graph
//       const data = JSON.parse(JSON.stringify(state.graphPoints));
//       data.current = id; // more than 8 points and data will shift down an index
//       if (!data[id]) {
//         data[id] = [];
//       } else if (data[id].length > 49) {
//         data[id] = data[id].slice(1);
//       }
//       // check if new object is a closed request with timeSent and timeReceived
//       if (!data[id].some((elem) => elem.timeSent === action.payload.timeSent)) {
//         // if a color hasn't been added to this specific request id, add a new one
//         const color = !data[id][0]?.color
//           ? `${Math.random() * 256}, ${Math.random() * 256}, ${
//               Math.random() * 256
//             }`
//           : data[id][0].color;
//         // add graphPoint to array connected to its id -and return to state
//         data[id].push({
//           reqRes: action.payload,
//           url: action.payload.url,
//           timeSent: action.payload.timeSent,
//           timeReceived: action.payload.timeReceived,
//           createdAt: action.payload.createdAt,
//           color,
//         });
//       }
//       state.graphPoints = data;
//     },

//     clearGraph(state, action: PayloadAction<number>) {
//       state.graphPoints[action.payload] = [];
//     },

//     clearAllGraph(state, action: PayloadAction<Collection>) {
//       state.graphPoints = {};
//     },

//     setComposerWarningMessage(
//       state,
//       action: PayloadAction<Record<string, string>>
//     ) {
//       state.warningMessage = action.payload;
//     },

//     setNewRequestFields(state, action: PayloadAction<Record<string, unknown>>) {
//       state.newRequestFields = action.payload;
//     },

//     setNewRequestHeaders(
//       state,
//       action: PayloadAction<Record<string, [] | number>>
//     ) {
//       state.newRequestHeaders = action.payload;
//     },

//     setNewRequestStreams(
//       state,
//       action: PayloadAction<Record<string, [] | number | string | null>>
//     ) {
//       state.newRequestStreams = action.payload;
//     },

//     setNewRequestBody(
//       state,
//       action: PayloadAction<Record<string, string | boolean>>
//     ) {
//       state.newRequestBody = action.payload;
//     },

//     setNewRequestCookies(
//       state,
//       action: PayloadAction<Record<string, [] | number>>
//     ) {
//       state.newRequestCookies = action.payload;
//     },

//     setNewTestContent(state, action: PayloadAction<string>) {
//       state.newRequestFields.testContent = action.payload;
//     },

//     setNewRequestSSE(state, action: PayloadAction<boolean>) {
//       state.newRequestSSE = { isSSE: action.payload };
//     },

//     setIntrospectionData(
//       state,
//       action: PayloadAction<Record<string, unknown>>
//     ) {
//       state.introspectionData = action.payload;
//     },

//     saveCurrentResponseData(
//       state,
//       action: PayloadAction<Record<string, unknown>>
//     ) {
//       state.currentResponse = action.payload;
//     },

//     setNewRequestsOpenAPI(
//       state,
//       action: PayloadAction<Record<string, unknown>>
//     ) {
//       state.newRequestsOpenAPI = action.payload;
//     },
//     // TODO: OpenAPI is not implemented, let's delete yes?
//     // setOpenAPIServersGlobal(state, action: PayloadAction<[]>) {
//     //   const openapiMetadata = { ...state.openapiMetadata };
//     //   openapiMetadata.serverUrls = [...state.openapiMetadata.serverUrls].filter(
//     //     (_, i) => action.payload.includes(i)
//     //   );
//     //   return {
//     //     ...state,
//     //     newRequestsOpenAPI: openapiMetadata,
//     //   };
//     // },
//     // setOpenAPIServers(state, action: PayloadAction<[]>) {
//     //   const { id, serverIds } = action.payload;
//     //   const request = [...state.openapiReqArray]
//     //     .filter(({ request }) => request.id === id)
//     //     .pop();
//     //   request.reqServers = [...state.openapiMetadata.serverUrls].filter(
//     //     (_, i) => serverIds.includes(i)
//     //   );
//     //   const openapiReqArray = [...state.openapiReqArray].push({ request });
//     //   return {
//     //     ...state,
//     //     newRequestsOpenAPI: openapiReqArray,
//     //   };
//     // },
//     // setOpenAPIParameter(state, action: PayloadAction<Record<string, unknown>>) {
//     //   const { id, location, name, value } = action.payload;
//     //   const request = [...state.openapiReqArray]
//     //     .filter(({ request }) => request.id === id)
//     //     .pop();
//     //   const urls = [...request.reqServers].map(
//     //     (url) => (url += request.endpoint)
//     //   );
//     //   switch (location) {
//     //     case 'path': {
//     //       urls.map((url) => url.replace(`{${name}}`, value));
//     //       request.urls = urls;
//     //       const openapiReqArray = [...state.openapiReqArray].push({ request });
//     //       return {
//     //         ...state,
//     //         newRequestsOpenAPI: openapiReqArray,
//     //       };
//     //     }
//     //     case 'query': {
//     //       urls.map((url) => {
//     //         if (url.slice(-1) !== '?') url += '?';
//     //         url += `${name}=${value}&`;
//     //       });
//     //       request.urls = urls;
//     //       const openapiReqArray = [...state.openapiReqArray].push({ request });
//     //       return {
//     //         ...state,
//     //         newRequestsOpenAPI: openapiReqArray,
//     //       };
//     //     }
//     //     case 'header': {
//     //       if (['Content-Type', 'Authorization', 'Accepts'].includes(key)) break;
//     //       request.headers.push({ name: value });
//     //       const openapiReqArray = [...state.openapiReqArray].push({ request });
//     //       return {
//     //         ...state,
//     //         newRequestsOpenAPI: openapiReqArray,
//     //       };
//     //     }
//     //     case 'cookie': {
//     //       request.cookies = value;
//     //       const openapiReqArray: [Record<string, unknown>] = [...state.openapiReqArray].push({ request });
//     //       return {
//     //         ...state,
//     //         newRequestsOpenAPI: openapiReqArray,
//     //       };
//     //     }
//     //     default: {
//     //       return state;
//     //     }
//     //   }
//     // },
//     // setOpenAPIRequestBody(state, action: PayloadAction<Record<string, unknown>>) {
//     //   const { id, mediaType, requestBody } = action.payload;
//     //   // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
//     //   const request: Record<string, unknown> = [...state.openapiReqArray]
//     //     .filter(({ request }) => request.id === id)
//     //     .pop();
//     //   const { method } = request;
//     //   if (
//     //     !['get', 'delete', 'head'].includes(method) &&
//     //     requestBody !== undefined
//     //   ) {
//     //     request.body = requestBody;
//     //     request.rawType = mediaType;
//     //   }
//     //   // @ts-expect-error ts-migrate(2339) FIXME: Property 'openapiReqArray' does not exist on type ... Remove this comment to see the full error message
//     //   const openapiReqArray = [...state.openapiReqArray].push({ request });
//     //   return {
//     //     ...state,
//     //     newRequestsOpenAPI: openapiReqArray,
//     //   };
//     // }
//   },
// });

// const { actions, reducer } = businessSlice;
// export const {
//   getHistory,
//   deleteFromHistory,
//   clearHistory,
//   getCollections,
//   deleteFromCollection,
//   resetComposerFields,
//   collectionToReqRes,
//   collectionAdd,
//   collectionUpdate,
//   reqResClear,
//   reqResItemAdded,
//   reqResDelete,
//   setChecksAndMinis,
//   reqResUpdate,
//   scheduledReqResUpdate,
//   scheduledReqResDelete,
//   updateGraph,
//   clearGraph,
//   clearAllGraph,
//   setComposerWarningMessage,
//   setNewRequestFields,
//   setNewRequestHeaders,
//   setNewRequestStreams,
//   setNewRequestBody,
//   setNewRequestCookies,
//   setNewTestContent,
//   setNewRequestSSE,
//   setIntrospectionData,
//   saveCurrentResponseData,
//   setNewRequestsOpenAPI,
// } = actions;
// export default reducer;

