/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import ContentsContainer from './ContentsContainer';
import SidebarContainer from './SidebarContainer';
import historyController from '../../controllers/historyController';
import collectionsController from '../../controllers/collectionsController';
import UpdatePopUpContainer from './UpdatePopUpContainer';
import ResponsePaneContainer from './ResponsePaneContainer';
import '../../../assets/style/App.scss';

declare global {
  interface Window {
    api: any;
  }
}

const { api } = window;

const App = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.send('check-for-update');
    historyController.getHistory();
    collectionsController.getCollections();
  });

  return (
    <div className="is-gapless is-tall">
      <div
        id="app"
        className={`columns is-gapless ${!message && 'is-tall'} ${
          message && 'is-tall-message'
        }`}
      >
        <HashRouter>
          <SidebarContainer />
          <ContentsContainer />
          <ResponsePaneContainer />
        </HashRouter>
      </div>
      <UpdatePopUpContainer message={message} setMessage={setMessage} />
    </div>
  );
};

export default App;
