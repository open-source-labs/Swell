import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";
import { HashRouter, Route, Switch, Link } from 'react-router-dom';


import ComposerNewRequest from "./NewRequest/ComposerNewRequest.jsx";
import RestContainer from "./RestContainer.jsx";
import GraphQLContainer from "./GraphQLContainer.jsx";
import GRPCContainer from "./GRPCContainer.jsx";
import WSContainer from "./WSContainer.jsx";

const mapStateToProps = (store) => ({
  reqResArray: store.business.reqResArray,
  composerDisplay: store.ui.composerDisplay,
  newRequestFields: store.business.newRequestFields,
  newRequestHeaders: store.business.newRequestHeaders,
  newRequestStreams: store.business.newRequestStreams,
  newRequestBody: store.business.newRequestBody,
  newRequestCookies: store.business.newRequestCookies,
  newRequestSSE: store.business.newRequestSSE,
  currentTab: store.business.currentTab,
  warningMessage: store.business.warningMessage,
  introspectionData: store.business.introspectionData,
});

const mapDispatchToProps = (dispatch) => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  setComposerWarningMessage: (message) => {
    dispatch(actions.setComposerWarningMessage(message));
  },
  setComposerDisplay: (composerDisplay) => {
    dispatch(actions.setComposerDisplay(composerDisplay));
  },
  setNewRequestHeaders: (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestStreams: (requestStreamsObj) => {
    dispatch(actions.setNewRequestStreams(requestStreamsObj));
  },
  setNewRequestFields: (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
  setNewRequestCookies: (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
  setNewRequestSSE: (requestSSEBool) => {
    dispatch(actions.setNewRequestSSE(requestSSEBool));
  },
});

const ComposerContainer = (props) => {
  return (
    //  OLD CODE
    // <div className="composerContents">
    //   <ComposerNewRequest {...props} />
    // </div>

    <div className="composerContents">
      <HashRouter>
        <div>
          {/* INSERT PROTOCOL DROPDOWN SELECTOR HERE */}
          <Link to="/compose-rest">Rest</Link>
          <Link to="/compose-grpc">GRPC</Link>
          <Link to="/compose-graphql">GraphQL</Link>
          <Link to="/compose-ws">WebSockets</Link>
          {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
        </div>
        <Switch>
          <Route path="/compose-rest"> <RestContainer {...props} /> </Route>
          <Route path="/compose-grpc"> <GRPCContainer {...props} /> </Route>
          <Route path="/compose-graphql"> <GraphQLContainer {...props} /> </Route>
          <Route path="/compose-ws"> <WSContainer {...props} /> </Route>
          <Route path="/"> <RestContainer {...props} /> </Route>
        </Switch>

      </HashRouter>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ComposerContainer);
