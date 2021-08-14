import * as types from '../actions/actionTypes';

const initialState = {
  // ...state,
  currentTab: 'First Tab',
  reqResArray: [],
  scheduledReqResArray: [],
  history: [],
  collections: [],
  warningMessage: {},
  newRequestFields: {
    protocol: 'openAPI',
    graphQL: false,
    gRPC: false,
    ws: false,
    webrtc: false,
    url: 'http://',
    method: 'GET',
    network: 'rest',
    testContent: '',
    testResults: [],
  },
  newRequestHeaders: {
    headersArr: [],
    count: 0,
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
};

const openAPIReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.: {
      return {
        ...state,
        history: action.payload,
      };
    }
    default: {

    }
  }
};
