/** 
 * @file Test to determine if the mockServerSlice reducer switches work.
 * **/

import mockServerReducer, 
    { initialState, 
        startServer, 
        stopServer } from '../../src/client/toolkit-refactor/slices/mockServerSlice';

describe('mockServerSlice', () => {
    it('state should be updated on server start', () => {
        const action = startServer();
        const sliceNewState = mockServerReducer(initialState, action);
        expect(sliceNewState.isServerStarted).toBe(true);
    });

    it('state should be updated on server stop', () => {
        const action = stopServer();
        const sliceNewState = mockServerReducer(initialState, action);
        expect(sliceNewState.isServerStarted).toBe(false);
    });
});