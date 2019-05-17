import reducer from '../src/client/reducers/ui'

describe('UI Reducer', () => {
  let state;
  
  beforeEach(() => {
    state = {
      isDisplayedModal: null,
      modalDisplay: 'Request',
    };
  })

  describe('SHOW_MODAL', () => {
    const action = { type: 'SHOW_MODAL'};

    it('should set isDisplayedModal to true', () => {
      const { isDisplayedModal } = reducer(state, action);
      expect(isDisplayedModal).toBe(true);
    })
  })

  describe('HIDE_MODAL', () => {
    const action = { type: 'HIDE_MODAL'};

    it('should set isDisplayedModal to false', () => {
      const { isDisplayedModal } = reducer(state, action);
      expect(isDisplayedModal).toBe(false);
    })
  })

  describe('SET_MODAL_DISPLAY', () => {
    const action = { type: 'SET_MODAL_DISPLAY', payload: 'CHANGE' }

    it('should update the modalDisplay', () => {
      const { modalDisplay } = reducer(state, action);
      expect(modalDisplay).toEqual(action.payload);
    })
  })
})