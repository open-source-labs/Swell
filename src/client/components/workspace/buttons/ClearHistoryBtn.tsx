import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import historyController from '../../../controllers/historyController';

import { WindowExt, WindowAPI } from '../../../../types'

// utilizing API we created in preload.js for node-free IPC communication
const { api } = window as any;

interface Props {
  historyCleared: () => void
};

const ClearHistoryBtn = (props: Props): JSX.Element => {
  const { historyCleared } = props;

  // cleanup api.receive event listener on dismount
  useEffect(() => {
    api.receive('clear-history-response', (res: { response: number }) => {
      // a response of 0 from main means user has selected 'confirm'
      if (res.response === 0) {
        historyController.clearHistoryFromIndexedDb();
        historyCleared();
      }
    });
  }, []);

  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

  const handleClick = () => {
    api.send('confirm-clear-history');
  };
  return (
    <button
      className={`ml-0 mt-3 mb-3 button is-small is-primary ${isDark ? 'is-dark-300' : 'is-outlined'} button-padding-verticals`}
      onClick={handleClick}
    >
      Clear History
    </button>
  );
};

export default ClearHistoryBtn;
