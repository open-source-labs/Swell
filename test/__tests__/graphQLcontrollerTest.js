import graphQLController from '../../src/client/controllers/graphQLController.ts';

describe('graphQLController', () => {
  describe('cookieFormatter', () => {
    it('should format cookie array', () => {
      // hardcode the cookie array
      const cookieArray = [
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie1',
          path: '/',
          secure: false,
          session: false,
          value: 'value1',
        },
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie2',
          path: '/',
          secure: false,
          session: false,
          value: 'value2',
        },
      ];
      // and the expected output
      const expectedOutput = [
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie1',
          path: '/',
          secure: false,
          session: false,
          value: 'value1',
        },
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie2',
          path: '/',
          secure: false,
          session: false,
          value: 'value2',
        },
      ];
      expect(graphQLController.cookieFormatter(cookieArray)).toEqual(
        expectedOutput
      );
    });
  });

  describe('introspect', () => {
    // mock the store
    jest.mock('../../src/client/rtk/store');

    // mock the get
    jest.mock('../../src/client/rtk/store', () => ({
      appDispatch: jest.fn(),
    }));

    beforeEach(() => {
      jest.resetAllMocks();
    });

    xit('should call api.send and api.receive with the correct arguments', () => {
      const url = 'https://example.com/graphql';
      const headers = [{ key: 'Content-Type', value: 'application/json' }];
      const cookies = [{ key: 'session_id', value: '1234' }];

      const mockIntrospectObject = {
        url,
        headers,
        cookies,
      };

      const mockIntrospectionQuery = {
        data: {
          __schema: {
            queryType: {
              name: 'Query',
            },
            mutationType: null,
            subscriptionType: null,
            types: [
              {
                kind: 'OBJECT',
                name: 'User',
                fields: [],
              },
            ],
          },
        },
      };

      api.receive.mockImplementationOnce((eventName, callback) => {
        expect(eventName).toBe('introspect-reply');

        callback(mockIntrospectionQuery);
      });

      introspect(url, headers, cookies);

      expect(api.send).toHaveBeenCalledWith(
        'introspect',
        JSON.stringify(mockIntrospectObject)
      );

      expect(appDispatch).toHaveBeenCalledWith(
        introspectionDataChanged({
          schemaSDL: expect.any(String),
          clientSchema: expect.any(Object),
        })
      );
    });

    xit('should dispatch an action with the error message if the introspection query returns an error', () => {
      const url = 'https://example.com/graphql';
      const headers = [{ key: 'Content-Type', value: 'application/json' }];
      const cookies = [{ key: 'session_id', value: '1234' }];

      const mockIntrospectObject = {
        url,
        headers,
        cookies,
      };

      const mockErrorMessage = 'Error: Please enter a valid GraphQL API URI';

      api.receive.mockImplementationOnce((eventName, callback) => {
        expect(eventName).toBe('introspect-reply');

        callback(mockErrorMessage);
      });

      introspect(url, headers, cookies);

      expect(api.send).toHaveBeenCalledWith(
        'introspect',
        JSON.stringify(mockIntrospectObject)
      );

      expect(appDispatch).toHaveBeenCalledWith(
        introspectionDataChanged(mockErrorMessage)
      );
    });

    // it('should send introspection query and dispatch introspectionDataChanged action', () => {
    //   const url = 'http://localhost:4000/graphql';
    //   const headers = [{ key: 'Authorization', value: 'Bearer <token>' }];
    //   const cookies = [];

    //   const expectedData = { schemaSDL: 'schema sdl', clientSchema: 'client schema' };
    //   const mockIntrospectionQuery = { __schema: { types: [] } };
    //   // jest.spyOn(graphQLController, 'buildClientSchema').mockReturnValueOnce('client schema');
    //   jest.spyOn(graphQLController, 'printSchema').mockReturnValueOnce('schema sdl');
    //   jest.spyOn(graphQLController, 'introspectionDataChanged').mockReturnValueOnce('introspectionDataChanged action');
    //   jest.spyOn(api, 'receive').mockImplementationOnce((eventName, callback) => callback(mockIntrospectionQuery));

    //   graphQLController.introspect(url, headers, cookies);

    //   expect(api.send).toHaveBeenCalledWith('introspect', JSON.stringify({ url, headers, cookies }));
    //   // expect(graphQLController.buildClientSchema).toHaveBeenCalledWith(mockIntrospectionQuery);
    //   expect(graphQLController.buildClientSchema).toHaveBeenCalledWithTimes(1);
    //   // expect(graphQLController.printSchema).toHaveBeenCalledWith('client schema');
    //   expect(graphQLController.printSchema).toHaveBeenCalledTimes(1);
    //   expect(appDispatch).toHaveBeenCalledWith(introspectionDataChanged(expectedData));
    // });
  });

  // Test cases for openGraphQLConnection
  describe('openGraphQLConnection', () => {
    const reqResObj = {
      connection: 'open',
      response: {
        cookies: [],
        events: [],
        headers: {},
      },
      timeSent: Date.now(),
    };

    xit('should initialize response data correctly', async () => {
      await graphQLController.openGraphQLConnection(reqResObj);

      expect(reqResObj.response.headers).toEqual({});
      expect(reqResObj.response.events).toEqual([]);
      expect(reqResObj.response.cookies).toEqual([]);
      expect(reqResObj.connection).toEqual('open');
      expect(reqResObj.timeSent).toBeGreaterThan(0);
    });

    it('should call sendGqlToMain', async () => {
      const sendGqlToMainSpy = jest.spyOn(graphQLController, 'sendGqlToMain');
      await graphQLController.openGraphQLConnection(reqResObj);
      // expect(sendGqlToMainSpy.response).toHaveBeenCalledWith({ reqResObj }.response);
      expect(sendGqlToMainSpy).toBeCalledTimes(1);
    });

    it('should handle response correctly', async () => {
      const response = {
        /* create a GraphQLResponse object */
      };
      const sendGqlToMainSpy = jest
        .spyOn(graphQLController, 'sendGqlToMain')
        .mockResolvedValue({ data: response, reqResObj });
      const handleResponseSpy = jest.spyOn(graphQLController, 'handleResponse');

      await graphQLController.openGraphQLConnection(reqResObj);

      expect(handleResponseSpy).toHaveBeenCalledWith(response, reqResObj);
    });

    it('should handle error correctly', async () => {
      const error = 'error';
      const sendGqlToMainSpy = jest
        .spyOn(graphQLController, 'sendGqlToMain')
        .mockResolvedValue({ error, reqResObj });
      const handleErrorSpy = jest.spyOn(graphQLController, 'handleError');

      await graphQLController.openGraphQLConnection(reqResObj);

      // expect(handleErrorSpy).toHaveBeenCalledWith(error, reqResObj);
      expect(handleErrorSpy).toBeCalledTimes(1);
    });
  });

  // Test cases for openGraphQLConnectionAndRunCollection
  describe('openGraphQLConnectionAndRunCollection', () => {
    const reqResArray = [
      /* create an array of ReqRes objects */
    ];

    xit('should call runSingleGraphQLRequest with the first object in the array', async () => {
      const runSingleGraphQLRequestSpy = jest.spyOn(
        graphQLController,
        'runSingleGraphQLRequest'
      );
      await graphQLController.openGraphQLConnectionAndRunCollection(
        reqResArray
      );
      expect(runSingleGraphQLRequestSpy).toHaveBeenCalledWith(reqResArray[0]);
    });

    // it('should call runSingleGraphQLRequest with the next object in the array after the first object has received a response', async () => {
    //   const response = { /* create a GraphQLResponse object */ };
    //   const sendGqlToMainSpy = jest.spyOn(graphQLController, 'sendGqlToMain')
    //     .mockResolvedValue({ data: response, reqResObj: reqResArray[0] });

    //   const runSingleGraphQLRequestSpy = jest.spyOn(graphQLController, 'runSingleGraphQLRequest');

    //   await graphQLController.openGraphQLConnectionAndRunCollection(reqResArray);

    //   expect(runSingleGraphQLRequestSpy).toHaveBeenCalledWith(reqResArray[1]);
    // });
  });
});

