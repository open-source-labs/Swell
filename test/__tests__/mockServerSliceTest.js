/** 
 * @file Test to determine if the mockServerSlice reducer switches work.
 * @todo - Check for possible edge cases
 * Covereage is all at 100%, so possibly no need to update testing
 * unless the slice itself was updated/edge cases found.
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