import React, { useState, useEffect, JSXElementConstructor } from 'react';
import { HashRouter } from 'react-router-dom';
import ContentsContainer from './ContentsContainer';
import SidebarContainer from './SidebarContainer';
import historyController from '../../controllers/historyController';
import collectionsController from '../../controllers/collectionsController';
import UpdatePopUpContainer from './UpdatePopUpContainer';
import ResponsePaneContainer from './ResponsePaneContainer';
import { WindowExt } from '../../../types'
import '../../../assets/style/App.scss';


const { api } = window as unknown as WindowExt;

const App = () => { //what type is being returned?
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.send('check-for-update');
    historyController.getHistory();
    collectionsController.getCollections();
  }, []); // added the empty array in attempt to fix the issue of the app rerendering when the bargraph is clicked -Prince

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
