import React, { useState, useEffect, JSXElementConstructor } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ContentsContainer from './ContentsContainer';
import SidebarContainer from './SidebarContainer';
import ResponsePaneContainer from './ResponsePaneContainer';
import RightSideContainer from './RightSideContainer';
import historyController from '../../controllers/historyController';
import collectionsController from '../../controllers/collectionsController';
import UpdatePopUpContainer from './UpdatePopUpContainer';
import { WindowExt } from '../../../types'
import '../../../assets/style/App.scss';
import NavBarContainer from './NavBarContainer';


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
    <div className="is-gapless is-tall">
      {/* Render the navigation bar container */}
      {/* TODO: Implement React Router framework here */}
      <HashRouter>
        <NavBarContainer /> 
        <Routes>
          <Route
            path="/"
            element={<p>placeholder for HTTP2 page</p>}
          />
          <Route
            path="/graphql"
            element={<p>placeholder for GRAPHQL page</p>}
          />
          <Route
            path="/grpc"
            element={<p>placeholder for GRPC page</p>}
          />
          <Route
            path="/websocket"
            element={<p>placeholder for WEB SOCKET page</p>}
          />
          <Route
            path="/webrtc"
            element={<p>placeholder for WEBRTC page</p>}
          />
          <Route
            path="/openapi"
            element={<p>placeholder for OPENAPI page</p>}
          />
          <Route
            path="/webhook"
            element={<p>placeholder for WEBHOOK page</p>}
          />
        </Routes>
      </HashRouter>

      <div
        id="app"
        className={`columns is-gapless ${!message && 'is-tall'} ${
          message && 'is-tall-message'
        }`}>
          <ContentsContainer />
          <div className="tile is-vertical add-vertical-scroll">
            <SidebarContainer />
            <ResponsePaneContainer />
          </div>
      </div>
      <UpdatePopUpContainer message={message} setMessage={setMessage} />
  </div>
  );
};

export default App;
