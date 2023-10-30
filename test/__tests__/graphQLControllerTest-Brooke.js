import graphQLController from '../../src/client/controllers/graphQLController.ts';

/*I went ahead and restructured the graphQLControllerTest file so that it mirrors the order in which the functions
appear in the graphQLController file -Brooke*/ 
describe('graphQLController', () => {

    /* the openGraphQLConnection function includes calls to sendGqlMain and handleRespnose, I created mocks for those functions
    to fully isolate openGraphQL functionality  */ 
    describe('openGraphQLConnection', () => {

        beforeAll(() => {
            graphQLController.sendGqlToMain = jest.fn().mockResolvedValue({}); // utilized mockResolvedValue since sendGqlToMain returns a promise 
             graphQLController.handleResponse = jest.fn();
        })

        afterEach(() => {
            graphQLController.sendGqlToMain.mockClear(); 
            graphQLController.handleResponse.mockClear(); 
        })

        it('should initialize response data correctly', async () => {
        const reqResObj = {};
        await graphQLController.openGraphQLConnection(reqResObj);

        /* each of these assertions checks the properties on the reqResObj to make sure they were updated correctly
        before being passed into the mock sendGqltoMain function  */ 
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.response.headers).toEqual({});
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.response.events).toEqual([]);
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.response.cookies).toEqual([]);
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.connection).toEqual('open');
        expect(graphQLController.sendGqlToMain.mock.calls[0][0].reqResObj.timeSent).toBeGreaterThan(0);
        });

        // it ('should call sendGqlToMain' , async () => {
        //     const sendGqlToMainSpy = jest.spyOn(graphQLController, 'sendGqlToMain');
        //     await graphQLController.openGraphQLConnection(reqResObj);
        //     // expect(sendGqlToMainSpy.response).toHaveBeenCalledWith({ reqResObj }.response);
        //     expect(sendGqlToMainSpy).toBeCalledTimes(1);
        //   });
        
        // })
    })
      

    // describe('sendGqlToMain', () => {
        
    // })

    // describe('openSubscription', () => {
        
    // })

    // describe('closeSubscription', () => {
        
    // })
    // describe('handleResponse', () => {
        
    // })

    // describe('handleError', () => {
        
    // })

    // describe('cookieFormatter', () => {
        
    //     it('should format cookie array', () => {
        
    //     // hardcode the cookie array
    //     const cookieArray = [
    //       {
    //         domain: 'localhost',
    //         expires: '2024-06-12T18:19:03.262Z',
    //         hostOnly: true,
    //         httpOnly: false,
    //         name: 'cookie1',
    //         path: '/',
    //         secure: false,
    //         session: false,
    //         value: 'value1',
    //       },
    //       {
    //         domain: 'localhost',
    //         expires: '2024-06-12T18:19:03.262Z',
    //         hostOnly: true,
    //         httpOnly: false,
    //         name: 'cookie2',
    //         path: '/',
    //         secure: false,
    //         session: false,
    //         value: 'value2',
    //       },
    //     ];
        
    //     // and the expected output
    //     const expectedOutput = [
    //       {
    //         domain: 'localhost',
    //         expires: '2024-06-12T18:19:03.262Z',
    //         hostOnly: true,
    //         httpOnly: false,
    //         name: 'cookie1',
    //         path: '/',
    //         secure: false,
    //         session: false,
    //         value: 'value1',
    //       },
    //       {
    //         domain: 'localhost',
    //         expires: '2024-06-12T18:19:03.262Z',
    //         hostOnly: true,
    //         httpOnly: false,
    //         name: 'cookie2',
    //         path: '/',
    //         secure: false,
    //         session: false,
    //         value: 'value2',
    //       },
    //     ];
        
    //     expect(graphQLController.cookieFormatter(cookieArray)).toEqual(
    //       expectedOutput
    //     );
    //   });
        
    // })
