/**
 * @todo - Check for possible edge cases
 * @todo - Look into increasing testing coverage to 100% across the board. The last test needs to be fixed as well.
 */

import newRequestOpenApiReducer, 
  { newServerAdded, 
    newParameterAdded,
    serversRemovedByIndex,
    requestBodyUpdated } from '../../src/client/toolkit-refactor/slices/newRequestOpenApiSlice';

describe('newRequestOpenApiSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      openApiMetadata: {
        info: {},
        tags: [],
        serverUrls: ['https://example.com', 'https://example.org'],
      },
      openApiReqArray: [
        {
          request: {
            id: 1,
          },
          headers: [],
          urls: ['https://example.com/test'],
          endpoint: '/test',
          reqServers: ['https://example.com'],
          serverIds: [0],
          cookies: '',
          method: 'get',
          body: '',
          mediaType: '',
          rawType: '',
        },
      ],
    };
  });

  describe('newServerAdded', () => {
    it('adds the new server to the appropriate request', () => {
      const newServer = {
        request: {
          id: 1,
        },
        headers: [],
        urls: [],
        endpoint: '/test',
        reqServers: [],
        serverIds: [1],
        cookies: '',
        method: 'get',
        body: '',
        mediaType: '',
        rawType: '',
      };

      const action = newServerAdded(newServer);
      const state = newRequestOpenApiReducer(initialState, action);

      expect(state.openApiReqArray).toHaveLength(2);
      expect(state.openApiReqArray[0].reqServers).toContain('https://example.org');
    });
  });

  describe('serversRemovedByIndex', () => {
    it('deletes a server given the appropriate request', () => {
      //Here just in case, but dont' believe the below initialState and actionPayloadTest are needed for this test
        // const initialState = {
        //   openApiMetadata: {
        //     info: {},
        //     tags: [],
        //     serverUrls: ['https://example.com', 'https://example.org'],
        //   },
        //   openApiReqArray: [
        //     {
        //       request: {
        //         id: 1,
        //       },
        //       headers: [],
        //       urls: ['https://example.com/test'],
        //       endpoint: '/test',
        //       reqServers: ['https://example.com'],
        //       serverIds: [0],
        //       cookies: '',
        //       method: 'get',
        //       body: '',
        //       mediaType: '',
        //       rawType: '',
        //     },
        //   ],
        // };
      // const newServer = {
      //   request: {
      //     id: 1,
      //   },
      //   headers: [],
      //   urls: [],
      //   endpoint: '/test',
      //   reqServers: [],
      //   serverIds: [1],
      //   cookies: '',
      //   method: 'get',
      //   body: '',
      //   mediaType: '',
      //   rawType: '',
      // };

      // const actionPayloadTest = {
      //   payload: [1, 2, 3],
      //   type: 'serversRemovedByIndex'
      // }

      const actionPayloadTest = [0, 1, 2];

      const action = serversRemovedByIndex(actionPayloadTest);
      const state = newRequestOpenApiReducer(initialState, action);

      expect(state.openApiReqArray).toHaveLength(1);
      expect(state.openApiReqArray[0].reqServers[0]).toContain('https://example.com');
    });
  });

  describe('newParameterAdded', () => {
    it('should update parameters based on user input', () => {
      let newParams = {
        id: 1,
        location: 'header',
        name: 'testHeaderParameter',
        value: 333
      };

      let action = newParameterAdded(newParams);
      let newState = newRequestOpenApiReducer(initialState, action);
      expect(newState.openApiReqArray[0].headers[0].name).toEqual(newParams.value);

      newParams.location = 'cookie';
      action = newParameterAdded(newParams);
      newState = newRequestOpenApiReducer(initialState, action);
      expect(newState.openApiReqArray[0].cookies).toEqual(newParams.value);

      newParams.location = 'query';
      action = newParameterAdded(newParams);
      newState = newRequestOpenApiReducer(initialState, action);
      expect(newState.openApiReqArray[0].urls[0]).toContain('testHeaderParameter=333');

      newParams.location = 'path';
      newParams.name = 'example';
      action = newParameterAdded(newParams);
      newState = newRequestOpenApiReducer(initialState, action);
      expect(newState.openApiReqArray[0].urls[0]).toContain(newParams.value);

    });
  });

  //The below test needs to be updated still - it looks like the body isn't correctly
  //being updated, but beeing added as a new object?
  describe('requestBodyUpdated', () => {
    it('updates the body of the request being sent', () => {
      const newMediaInfo = {
        requestId: 1,
        mediaType: 'test123',
        requestBody: 'anyTest321'
      }

      const action = requestBodyUpdated(newMediaInfo);
      const state = newRequestOpenApiReducer(initialState, action);

      expect(state.openApiReqArray.length).toEqual(2);
    });
  });
});