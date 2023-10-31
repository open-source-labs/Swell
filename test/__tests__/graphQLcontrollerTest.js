import graphQLController from '../../src/client/controllers/graphQLController.ts';

/*I went ahead and restructured the graphQLControllerTest file so that it mirrors the order in which the functions
appear in the graphQLController file -Brooke*/ 
describe('graphQLController', () => {

    /* the openGraphQLConnection function includes calls to sendGqlMain, handleRespnose and handleError, I created mocks for those functions
    to fully isolate openGraphQL functionality, mocks are local to each test suite  */ 
    describe('openGraphQLConnection', () => {

        beforeAll(() => {
            graphQLController.sendGqlToMain = jest.fn().mockResolvedValue({}); // utilized mockResolvedValue since sendGqlToMain returns a promise 
            graphQLController.handleResponse = jest.fn();
            graphQLController.handleError = jest.fn(); 
        })

        afterEach(() => {
            graphQLController.sendGqlToMain.mockClear(); 
            graphQLController.handleResponse.mockClear(); 
            graphQLController.handleError.mockClear(); 
        })

        it('should initialize response data correctly', async () => {
        const reqResObj = {};
        await graphQLController.openGraphQLConnection(reqResObj);

        /* each of these assertions checks the properties on the reqResObj to make sure they were updated correctly
        before being passed into the mock sendGqltoMain function, previously this test checked the properties of a hardcoded object  */ 
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.response.headers).toEqual({});
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.response.events).toEqual([]);
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.response.cookies).toEqual([]);
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.connection).toEqual('open');
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.timeSent).toBeGreaterThan(0);
        });

        it ('should call sendGqlToMain' , async () => {
            await graphQLController.openGraphQLConnection({});
            expect(graphQLController.sendGqlToMain).toBeCalledTimes(1);
          });
        })

        /* check handleError and handleResponse branches after sendGqlToMain call */ 
        it('should call handleError if sendGqlToMain returns an object with an error property', async () => {
            // updated resolved value of sendGqlToMain to include an error that triggers the error conditional 
            graphQLController.sendGqlToMain = jest.fn().mockResolvedValue({error: true, reqResObj: {error: true}}) 
            await graphQLController.openGraphQLConnection({});
            expect(graphQLController.handleError).toBeCalledTimes(1);
          });

        it('should call handleResponse if sendGqlToMain returns an object without an error property', 
        async () => {
            // reassigned resolved value to empty object following previous test case 
            graphQLController.sendGqlToMain = jest.fn().mockResolvedValue({})
            await graphQLController.openGraphQLConnection({});
            expect(graphQLController.handleResponse).toBeCalledTimes(1);
          });
    });
      
    /* the openGraphQLConnetionAndRunCollection function is run when the reqResObj at the first reqResArray index is graphQL and 
    the user selects 'test collection' (instead of 'send test'), this functionality currently does not work and needs refactoring,
    the tests should be written alongside this process -Brooke */ 
    describe('openGraphQLConnectionAndRunCollection', () => {});

    describe('sendGqlToMain', () => {});

    /* runs when user selects a subscription graphQL test, no previous tests written */ 
    describe('openSubscription', () => {});

    describe('closeSubscription', () => {});
    
    describe('handleResponse', () => {});

    describe('handleError', () => {});

    describe('cookieFormatter', () => {

        /* test written by previous iteration group that hardcodes an input cookie array and expected output array
        and checks if the output of graphQLController.cookieformatter(input) returns the expected output */ 
        it('should format cookie array', () => {
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
          
          expect(graphQLController.cookieFormatter(cookieArray)).toEqual(expectedOutput);
        
        });

        /* all of the test cases that were in previous tests were commented out and failed when recommented in, tried manual tests
        in dev app and the introspect functionality appears to be broken, would recommend writing new tests during debugging/refactoring process */
        describe('introspect', () => {})
    
    });