import React, { useState, useEffect, JSXElementConstructor } from 'react';
import { HashRouter } from 'react-router-dom';
import ContentsContainer from './ContentsContainer';
import SidebarContainer from './SidebarContainer';
import ResponsePaneContainer from './ResponsePaneContainer';
import RightSideContainer from './RightSideContainer';
import historyController from '../../controllers/historyController';
import collectionsController from '../../controllers/collectionsController';
import UpdatePopUpContainer from './UpdatePopUpContainer';
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
    // deleted is-tall below
    <div className=" is-gapless is-tall">
      <div
        id="app"
        className={`columns is-gapless ${!message && 'is-tall'} ${
          message && 'is-tall-message'
        }`}
      >
        {/* <HashRouter> */}
        {/* <div className="tile is-ancestor"> */}
          {/* <div className="tile is-parent"> */}
            <ContentsContainer />
          {/* </div> */}
          <div className="tile is-vertical add-vertical-scroll">
            <SidebarContainer />
            <ResponsePaneContainer />
          </div>
        {/* </div> */}
        {/* </HashRouter> */}
      </div>
      <UpdatePopUpContainer message={message} setMessage={setMessage} />
  </div>
  );
};

export default App;
