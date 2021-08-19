import uiReducer from '../src/client/reducers/ui';
// import { SET_COMPOSER_DISPLAY } from '../src/client/actions/actionTypes';

describe('UI Reducer', () => {
  let state;

  beforeEach(() => {
    state = {
      composerDisplay: 'Request',
      sidebarActiveTab: 'composer',
      workspaceActiveTab: 'workspace',
      responsePaneActiveTab: 'events',
    };
  });

  describe('default state', () => {
    it('should return a default state when given an undefined input', () => {
      expect(uiReducer(undefined, { type: undefined })).toEqual(state);
    });
    it('should return default state with unrecognized action types', () => {
      expect(uiReducer(undefined, { type: 'BAD_TYPE' })).toEqual(state);
    });
  });

  describe('should handle SET_COMPOSER_DISPLAY', () => {
    const action = {
      type: 'SET_COMPOSER_DISPLAY',
      payload: 'warning',
    };

    it('should update the composerDisplay', () => {
      const { composerDisplay } = uiReducer(state, action);
      expect(composerDisplay).toEqual(action.payload);
    });
  });
});
