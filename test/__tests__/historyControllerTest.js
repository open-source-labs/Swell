import db from '../../src/client/db';
import historyController from '../../src/client/controllers/historyController';
import { appDispatch } from '../../src/client/toolkit-refactor/store';
import { historySet } from '../../src/client/toolkit-refactor/slices/historySlice';

jest.mock('../../src/client/db');
jest.mock('../../src/client/toolkit-refactor/store');

describe('historyController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addHistoryToIndexedDb', () => {
    it('adds a req/res to the db', () => {
      const reqRes = { id: '1', request: {}, response: {}, createdAt: new Date() };

      db.table.mockReturnValue({
        put: jest.fn().mockResolvedValue(null),
      });

      historyController.addHistoryToIndexedDb(reqRes);

      expect(db.table).toHaveBeenCalledWith('history');
      expect(db.table().put).toHaveBeenCalledWith(reqRes);
    });
  });

  describe('deleteHistoryFromIndexedDb', () => {
    it('deletes a req/res from the db', () => {
      const id = '1';

      db.table.mockReturnValue({
        delete: jest.fn().mockResolvedValue(null),
      });

      historyController.deleteHistoryFromIndexedDb(id);

      expect(db.table).toHaveBeenCalledWith('history');
      expect(db.table().delete).toHaveBeenCalledWith(id);
    });
  });

  describe('clearHistoryFromIndexedDb', () => {
    it('clears all req/res from the db', () => {
      db.table.mockReturnValue({
        clear: jest.fn().mockResolvedValue(null),
      });

      historyController.clearHistoryFromIndexedDb();

      expect(db.table).toHaveBeenCalledWith('history');
      expect(db.table().clear).toHaveBeenCalled();
    });
  });

  describe('getHistory', () => {
    xit('gets req/res history from the db and dispatches them to the store', async () => {
      const reqRes = { id: '1', request: {}, response: {}, createdAt: new Date() };
      const history = [reqRes];

      db.table.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(history),
      });

      const dispatchSpy = jest.spyOn(appDispatch, 'mockReturnValue');
      historySet.mockReturnValue({ type: 'history/set' });

      await historyController.getHistory();

      expect(db.table).toHaveBeenCalledWith('history');
      expect(db.table().toArray).toHaveBeenCalled();

      expect(dispatchSpy).toHaveBeenCalledWith(historySet(expect.any(Array)));
      expect(historySet).toHaveBeenCalledWith(expect.any(Array));

      expect(historySet.mock.calls[0][0][0].date).toBeDefined();
      expect(historySet.mock.calls[0][0][0].history).toEqual(history);
    });

    it('handles errors', async () => {
      db.table.mockReturnValue({
        toArray: jest.fn().mockRejectedValue('error'),
      });

      console.error = jest.fn();

      await historyController.getHistory();

      expect(console.error).toHaveBeenCalledWith('Error in getHistory', 'error');
    });
  });
});