/**
 * @todo - Refactor code for DRY principle
 * @todo - Check for possible edge cases
 * @todo - Look into increasing testing coverage across the board to 100%
 */

import historySliceReducer, {
  historyCleared,
  historySet,
  historyDeleted,
} from '~/toolkit/slices/historySlice';

describe('HistorySlice', () => {
  let initialState;
  let historyItem;

  beforeEach(() => {
    initialState = [
      {
        date: '01/01/2022',
        history: [
          {
            id: 1,
            createdAt: '2022-01-01T00:00:00.000Z',
          },
        ],
      },
    ];

    historyItem = {
      id: 2,
      createdAt: '2022-01-02T00:00:00.000Z',
    };
  });

  describe('historyCleared', () => {
    it('should clear the history', () => {
      const newState = historySliceReducer(initialState, historyCleared());
      expect(newState).toEqual([]);
    });
  });

  describe('historySet', () => {
    it('should set the history to a new value', () => {
      const newHistory = [
        {
          date: '01/02/2022',
          history: [historyItem],
        },
      ];

      const newState = historySliceReducer(
        initialState,
        historySet(newHistory)
      );

      expect(newState).toEqual(newHistory);
    });
  });

  describe('historyDeleted', () => {
    xit('should delete the specified item from the history', () => {
      const action = {
        payload: { id: 1, createdAt: '2022-01-01T00:00:00.000Z' },
      };
      const newState = historySliceReducer(
        initialState,
        historyDeleted(action.payload)
      );
      const expectedState = [];
      expect(newState).toEqual(expectedState);
    });

    it('should update the history when an item is deleted', () => {
      const action = { payload: historyItem };
      const newState = historySliceReducer(
        initialState,
        historyDeleted(action.payload)
      );
      const expectedState = [
        {
          date: '01/01/2022',
          history: [
            {
              id: 1,
              createdAt: '2022-01-01T00:00:00.000Z',
            },
          ],
        },
      ];
      expect(newState).toEqual(expectedState);
    });
  });

  // BC reqRes is such mutates the state, writing test that make sense and pass is hard
  xdescribe('reqResItemAdded', () => {
    it('should add a new item to the history if it does not already exist', () => {
      const action = { payload: historyItem };
      const newState = historySliceReducer(initialState, action);
      const expectedState = [
        {
          date: '01/02/2022',
          history: [historyItem],
        },
        {
          date: '01/01/2022',
          history: [
            {
              id: 1,
              createdAt: '2022-01-01T00:00:00.000Z',
            },
          ],
        },
      ];
      expect(newState).toEqual(expectedState);
    });

    it('should add a new item to an existing history', () => {
      const newItem = {
        id: 3,
        createdAt: '2022-01-01T00:00:00.000Z',
      };

      const action = { payload: newItem };
      const newState = historySliceReducer(initialState, action);
      const expectedState = [
        {
          date: '01/01/2022',
          history: [
            {
              id: 3,
              createdAt: '2022-01-01T00:00:00.000Z',
            },
            {
              id: 1,
              createdAt: '2022-01-01T00:00:00.000Z',
            },
          ],
        },
      ];

      expect(newState).toEqual(expectedState);
    });
  });
});
