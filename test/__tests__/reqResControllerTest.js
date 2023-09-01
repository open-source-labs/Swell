import store from '~/toolkit/store';
import { reqResReplaced } from '~/toolkit/slices/reqResSlice';
import connectionController from '~/toolkit/controllers/reqResController';

jest.mock('../../src/client/rtk/store', () => ({
  __esModule: true,
  default: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
  appDispatch: jest.fn(),
}));

jest.mock('../../src/client/rtk/slices/reqResSlice', () => ({
  __esModule: true,
  reqResReplaced: jest.fn(),
}));

describe('connectionController', () => {
  // toggleSelectAll method
  describe('toggleSelectAll', () => {
    it('should toggle all the checked values for to true if starting at false', () => {
      // Set up the initial state of the reqResArray
      // there is something
      const initialState = {
        reqRes: {
          reqResArray: [
            { id: 0, checked: false },
            { id: 2, checked: false },
            { id: 3, checked: false },
          ],
        },
      };

      // Mock the Store.getState function to return the initial state
      store.getState.mockReturnValue(initialState);

      // Call the toggleSelectAll function and assert that the checked state has been toggled for all objects in the reqResArray
      connectionController.toggleSelectAll();
      expect(initialState.reqRes.reqResArray[0].checked).toBe(true);
      expect(initialState.reqRes.reqResArray[1].checked).toBe(true);
      expect(initialState.reqRes.reqResArray[2].checked).toBe(true);

      // Assert that the reqResReplaced action was called with the modified reqResArray
      expect(reqResReplaced).toHaveBeenCalledWith(
        initialState.reqRes.reqResArray
      );
    });

    it('should toggle all the checked values for to false if starting at false', () => {
      // Set up the initial state of the reqResArray
      // there is something
      const initialState = {
        reqRes: {
          reqResArray: [
            { id: 0, checked: true },
            { id: 2, checked: true },
            { id: 3, checked: true },
          ],
        },
      };

      // Mock the Store.getState function to return the initial state
      store.getState.mockReturnValue(initialState);

      // Call the toggleSelectAll function and assert that the checked state has been toggled for all objects in the reqResArray
      connectionController.toggleSelectAll();
      expect(initialState.reqRes.reqResArray[0].checked).toBe(false);
      expect(initialState.reqRes.reqResArray[1].checked).toBe(false);
      expect(initialState.reqRes.reqResArray[2].checked).toBe(false);

      // Assert that the reqResReplaced action was called with the modified reqResArray
      expect(reqResReplaced).toHaveBeenCalledWith(
        initialState.reqRes.reqResArray
      );
    });
  });
});

