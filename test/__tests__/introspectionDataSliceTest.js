/**
 * @todo - Check for possible edge cases
 * Covereage is all at 100%, so possibly no need to update testing
 * unless the slice itself was updated/edge cases found.
 */

import IntrospectionDataReducer, {
  initialState,
  introspectionDataChanged,
} from '../../src/client/rtk/slices/introspectionDataSlice';

describe('introspectionDataSlice', () => {
  it('state should be updated via new information received', () => {
    const testIntrospectionData = {
      schemaSDL: 'test one',
      clientSchema: {
        name: 'graphQL Schema name test',
        id: 1,
      },
    };
    const action = introspectionDataChanged(testIntrospectionData);
    const sliceInitialState = IntrospectionDataReducer(initialState, action);
    expect(sliceInitialState).toBe(testIntrospectionData);
  });
});
