import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '~/toolkit/store';
import historyController from '~/controllers/historyController';
import { type WindowExt } from '~/types';

// utilizing API we created in preload.js for node-free IPC communication
const { api } = window as unknown as WindowExt;

interface Props {
  historyCleared: () => void;
}

const ClearHistoryBtn = ({ historyCleared }: Props) => {
  const isDark = useAppSelector((state) => state.ui.isDark);

  /**
   * It doesn't seem that the below effect should re-run if historyCleared
   * changes its memory reference each render. This is a quick and dirty way
   * of implementing the upcoming useEffectEvent hook to make sure there's no
   * need to specify historyCleared in the dependency array
   */
  const historyClearedRef = useRef(historyCleared);
  useEffect(() => {
    historyClearedRef.current = historyCleared;
  }, [historyCleared]);

  /**
   * @todo 2023-08-31 According to the previous comment, this effect does set up
   * a subscription, which does need to be cleaned up on unmount. However, the
   * api.receive method does not give you an unsubscribe callback as its return
   * value. Update api.receive so that it lets you unsubscribe, and then
   * add a cleanup function in this effect that calls the returned unsubscribe
   * callback.
   */
  useEffect(() => {
    api.receive('clear-history-response', (res: { response: number }) => {
      // a response of 0 from main means user has selected 'confirm'
      if (res.response === 0) {
        historyController.clearHistoryFromIndexedDb();
        historyClearedRef.current();
      }
    });
  }, []);

  return (
    <button
      type="button"
      onClick={() => api.send('confirm-clear-history')}
      className={`ml-0 mt-3 mb-3 button is-small is-primary ${
        isDark ? '' : 'is-outlined'
      } button-padding-verticals`}
    >
      Clear History
    </button>
  );
};

export default ClearHistoryBtn;
