/**
 * @todo - Update testing to be more dyanmic once code base is restructured/re-organized.
 * Currently the codebase is having performance/memory leak issues - it is also handling state
 * incorrectly by directly mutating it. Look to update wiht jest.mock() and jest.fn() instead of
 * hard code.
 */

import newRequestReducer, {
  newRequestHeadersSet,
  newRequestBodySet,
  newRequestStreamsSet,
  newRequestCookiesSet,
  newRequestSSESet,
  composerFieldsReset,
  newRequestContentByProtocol,
} from '../../src/client/toolkit-refactor/slices/newRequestSlice';

describe('newRequestSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      newRequestHeaders: {
        headersArr: [],
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
        protoPath: '',
        services: null,
        protoContent: '',
      },
      newRequestCookies: {
        cookiesArr: [],
        count: 0,
      },
      newRequestSSE: {
        isSSE: false,
      },
      newRequestWebRTC: {
        network: 'webrtc',
        webRTCEntryMode: 'Manual',
        webRTCDataChannel: 'Text',
        webRTCWebsocketServer: '',
        webRTCOffer: '',
        webRTCAnswer: '',
        webRTCpeerConnection: null,
        webRTCLocalStream: null,
        webRTCRemoteStream: null,
        webRTCMessages: [],
      },
    };
  });

  describe('newRequestHeadersSet', () => {
    it('should set new request headers', () => {
      const headers = {
        headersArr: [{ key: 'Content-Type', value: 'application/json' }],
        count: 1,
      };
      const action = newRequestHeadersSet(headers);
      const newState = newRequestReducer(initialState, action);

      expect(newState.newRequestHeaders).toEqual(headers);
    });
  });

  describe('newRequestBodySet', () => {
    it('should set new request streams', () => {
      const testBody = {
        bodyContent: 'this is the test body',
        bodyVariables: 'testVariable',
        bodyType: 'raw',
        rawType: 'text/plain',
        JSONFormatted: true,
        bodyIsNew: true,
      };
      const action = newRequestBodySet(testBody);
      const newState = newRequestReducer(initialState, action);
      expect(newState.newRequestBody).toBe(testBody);
    });
  });

  describe('newRequestStreamsSet', () => {
    it('should set new request body', () => {
      const testStreams = {
        streamsArr: ['testOne', 'testTwo'],
        count: 2,
        streamContent: ['oneTest', 'twoTest'],
        selectedPackage: 'testPackage',
        selectedRequest: 'testRequest',
        selectedService: 'testService',
        selectedServiceObj: null,
        selectedStreamingType: 'testType',
        initialQuery: null,
        queryArr: ['queryOne', 'queryTwo'],
        protoPath: null,
        services: 'testServices',
        protoContent: 'testProtoContent',
      };

      const action = newRequestStreamsSet(testStreams);
      const newState = newRequestReducer(initialState, action);
      expect(newState.newRequestStreams).toBe(testStreams);
    });
  });

  describe('newRequestCookiesSet', () => {
    it('should set new cookies body', () => {
      const testCookies = {
        cookiesArr: ['1a2b3c', '4d5e6f'],
        count: 2,
      };

      const action = newRequestCookiesSet(testCookies);
      const newState = newRequestReducer(initialState, action);
      expect(newState.newRequestCookies).toBe(testCookies);
    });
  });

  describe('newRequestSSESet', () => {
    it('should trigger the SSE switch', () => {
      const action = newRequestSSESet(true);
      const newState = newRequestReducer(initialState, action);
      expect(newState.newRequestSSE.isSSE).toBe(true);
    });
  });

  describe('composerFieldsReset', () => {
    it('should reset composer fields', () => {
      const newState = newRequestReducer(initialState, composerFieldsReset());
      expect(newState).toEqual(initialState);
    });
  });

  describe('newRequestContentByProtocol', () => {
    it('should return initial state for unknown protocol', () => {
      const result = newRequestReducer(
        initialState,
        newRequestContentByProtocol('unknown')
      );
      expect(result).toEqual(initialState);
    });

    /**
     * @todo - Modularize the below test as it only has 1 Jest "it" statement.
     * Also to note, in the newRequestSlice itself there are many other features still under WIP.
     * Below test is currently written for the features that have some functionality.
     */
    it('should compose a new request store for a known protocol', () => {
      let expected = {
        ...initialState,
        newRequestBody: {
          ...initialState.newRequestBody,
          bodyType: 'TRPC',
          bodyVariables: '',
        },
      };

      let result = newRequestReducer(
        initialState,
        newRequestContentByProtocol('tRPC')
      );
      expect(result).toEqual(expected);

      expected.newRequestBody.bodyType = 'GQL';
      result = newRequestReducer(
        initialState,
        newRequestContentByProtocol('graphQL')
      );
      expect(result).toEqual(expected);

      expected.newRequestBody.bodyType = 'GRPC';
      result = newRequestReducer(
        initialState,
        newRequestContentByProtocol('grpc')
      );
      expect(result).toEqual(expected);

      expected.newRequestBody.bodyType = 'raw';
      result = newRequestReducer(
        initialState,
        newRequestContentByProtocol('webrtc')
      );
      expect(result).toEqual(expected);
    });
  });
});
