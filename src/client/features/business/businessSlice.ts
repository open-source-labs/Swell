import { format } from 'date-fns';
import { createSlice } from '@reduxjs/toolkit'
import { ReqRes } from '../../../types';
import { stat } from 'fs/promises';
import * as types from '../../actions/actionTypes';

// jNote - build interface for state TODO: this should be in types?
interface State {
  currentTab: string,
  reqResArray: [],
  scheduledReqResArray: [],
  history: [],
  collections: [],
  warningMessage: Record<string, unknown>,
  newRequestsOpenAPI: {
    openapiMetadata: {
      info: Record<string, unknown>,
      tags: [],
      serverUrls: [],
    },
    openapiReqArray: [],
  },
  newRequestFields: {
    protocol: string,
    restUrl: string,
    wsUrl: string,
    gqlUrl: string,
    grpcUrl: string,
    webrtcUrl: string,
    url: string,
    method: string,
    graphQL: boolean,
    gRPC: boolean,
    ws: boolean,
    openapi: boolean,
    webrtc: boolean,
    webhook: boolean,
    network: string,
    testContent: string,
    testResults: [],
    openapiReqObj: Record<string, unknown>,
  },
  newRequestHeaders: {
    headersArr: [],
    count: number,
  },
  newRequestStreams: {
    streamsArr: [],
    count: number,
    streamContent: [],
    selectedPackage: null,
    selectedRequest: null,
    selectedService: null,
    selectedServiceObj: null,
    selectedStreamingType: null,
    initialQuery: null,
    queryArr: null,
    protoPath: null,
    services: null,
    protoContent: string,
  },
  newRequestCookies: {
    cookiesArr: [],
    count: number,
  },
  newRequestBody: {
    bodyContent: string,
    bodyVariables: string,
    bodyType: string,
    rawType: string,
    JSONFormatted: boolean,
    bodyIsNew: boolean,
  },
  newRequestSSE: {
    isSSE: boolean,
  },
  newRequestOpenAPIObject: {
    request: {
      id: number,
      enabled: boolean,
      reqTags: [],
      reqServers: [],
      summary: string,
      description: string,
      operationId: string,
      method: string,
      endpoint: string,
      headers: Record<string, unknown>,
      parameters: [],
      body: Record<string, unknown>,
      urls: [],
    },
  },
  introspectionData: { schemaSDL: null, clientSchema: null },
  dataPoints: Record<string, unknown>,
  currentResponse: {
    request: {
      network: string,
    },
  },
};

// jNote - need to tie it to state interface
const initialState: State = {
  currentTab: 'First Tab',
  reqResArray: [],
  scheduledReqResArray: [],
  history: [],
  collections: [],
  warningMessage: {},
  newRequestsOpenAPI: {
    openapiMetadata: {
      info: {},
      tags: [],
      serverUrls: [],
    },
    openapiReqArray: [],
  },
  newRequestFields: {
    protocol: '',
    restUrl: 'http://',
    wsUrl: 'ws://',
    gqlUrl: 'https://',
    grpcUrl: '',
    webrtcUrl: '',
    url: 'http://',
    method: 'GET',
    graphQL: false,
    gRPC: false,
    ws: false,
    openapi: false,
    webrtc: false,
    webhook: false,
    network: 'rest',
    testContent: '',
    testResults: [],
    openapiReqObj: {},
  },
  newRequestHeaders: {
    headersArr: [],
    count: 0,
  },
  newRequestStreams: {
    streamsArr: [],
    count: 0,
    streamContent: [],
    selectedPackage: null,
    selectedRequest: null,
    selectedService: null,
    selectedServiceObj: null,
    selectedStreamingType: null,
    initialQuery: null,
    queryArr: null,
    protoPath: null,
    services: null,
    protoContent: '',
  },
  newRequestCookies: {
    cookiesArr: [],
    count: 0,
  },
  newRequestBody: {
    bodyContent: '',
    bodyVariables: '',
    bodyType: 'raw',
    rawType: 'text/plain',
    JSONFormatted: true,
    bodyIsNew: false,
  },
  newRequestSSE: {
    isSSE: false,
  },
  newRequestOpenAPIObject: {
    request: {
      id: 0,
      enabled: true,
      reqTags: [],
      reqServers: [],
      summary: '',
      description: '',
      operationId: '',
      method: '',
      endpoint: '',
      headers: {},
      parameters: [],
      body: {},
      urls: [],
    },
  },
  introspectionData: { schemaSDL: null, clientSchema: null },
  dataPoints: {},
  currentResponse: {
    request: {
      network: '',
    },
  },
};

const businessSlice = createSlice({
  name: '',
  initialState,
  reducers: {
    GET_HISTORY(state: State, action: { date: string; history: ReqRes[]; }[]) {
      state.history = action.payload;
    }
    deleteHistory(state, action) {
      const deleteId: number = action.payload.id;
      const deleteDate: string = format(action.payload.createdAt, 'MM/dd/yyyy');
      const newHistory = JSON.parse(JSON.stringify(state.history));
      newHistory.forEach((obj, i) => {
        if (obj.date === deleteDate)
          obj.history = obj.history.filter((hist) => hist.id !== deleteId);
        if (obj.history.length === 0) {
          newHistory.splice(i, 1);
        }
      });
    }
  }
})

export default businessReducer;
