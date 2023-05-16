/** 
 * @file Test to determine if the mockServerSlice reducer switches work.
 * This test has been completed.
 * **/

import warningMessageReducer, 
    { initialState, 
        setWarningMessage } from '../../src/client/toolkit-refactor/slices/warningMessageSlice';

describe('warningMessageSlice', () => {
    it('state should be updated on server start', () => {
        const warningMessageExample = {
            paylod: {
                err: 'error message',
                uri: 'uri link',
                body: 'body message'
            }
        };
        const action = setWarningMessage(warningMessageExample);
        const sliceNewState = warningMessageReducer(initialState, action);
        expect(sliceNewState).toBe(warningMessageExample);
    });
});