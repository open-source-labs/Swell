import IntrospectionDataReducer, 
    { initialState,
        introspectionDataChanged } from '../../src/client/toolkit-refactor/slices/introspectionDataSlice';

describe('introspectionDataSlice', () => {
    it('state should be updated via new information received', () => {
        const testIntrospectionData = {
            schemaSDL: 'test one',
            clientSchema: {
                name: 'graphQL Schema name test',
                id: 1
            }
        }
        const action = introspectionDataChanged(testIntrospectionData);
        const sliceInitialState = IntrospectionDataReducer(initialState, action);
        expect(sliceInitialState).toBe(testIntrospectionData);
    });
});