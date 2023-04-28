import newRequestOpenApiReducer, 
  { newServerAdded, 
    newParameterAdded } from '../../src/client/toolkit-refactor/slices/newRequestOpenApiSlice';

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

  // xdescribe('serversRemovedByIndex'), () => {
  //   it('deletes a server given the appropriate request', () => {
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
  
        // const action =serversRemovedByIndex(newServer);
        // const state = newRequestOpenApiReducer(initialState, action);
  
        // expect(state.openApiReqArray).toHaveLength(2);
        // expect(state.openApiReqArray[0].reqServers[0]).toContain('https://example.org');
  //     });
  // };

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
});