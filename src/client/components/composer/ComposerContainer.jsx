import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Link } from 'react-router-dom';
import * as actions from "../../actions/actions";

import NetworkDropdown from "./NetworkDropdown"
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
  resetComposerFields : () => {
    dispatch(actions.resetComposerFields());
  }
});

const ComposerContainer = (props) => {

  const onProtocolSelect = (network) => {
    if (props.warningMessage.uri) {
      const warningMessage = { ...props.warningMessage };
      delete warningMessage.uri;
      props.setComposerWarningMessage({ ...warningMessage });
    }
    props.setComposerWarningMessage({});
    switch (network) {
      case "graphql": {
          //if graphql
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: "",
            url: props.newRequestFields.gqlUrl,
            method: "QUERY",
            graphQL: true,
            gRPC: false,
            network: "graphQL",
          });
          props.setNewRequestBody({
            //when switching to GQL clear body
            ...props.newRequestBody,
            bodyType: "GQL",
            bodyContent: `query {

}`,
            bodyVariables: "",
          });
          break;
      }
      case "rest": {
          //if http/s
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: "",
            url: props.newRequestFields.restUrl,
            method: "GET",
            graphQL: false,
            gRPC: false,
            network: "rest",
          });
          props.setNewRequestBody({
            //when switching to http clear body
            ...props.newRequestBody,
            bodyType: "none",
            bodyContent: ``,
          });
          break;
      }
      case "grpc": {
          //if gRPC
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: "",
            url: props.newRequestFields.grpcUrl,
            method: "",
            graphQL: false,
            gRPC: true,
            network: "grpc",
          });
          props.setNewRequestBody({
            //when switching to gRPC clear body
            ...props.newRequestBody,
            bodyType: "GRPC",
            bodyContent: ``,
          });
          break;
      }
      case "ws": {
          //if ws
          props.setNewRequestFields({
            ...props.newRequestFields,
            protocol: "",
            url: props.newRequestFields.wsUrl,
            method: "",
            graphQL: false,
            gRPC: false,
            network: "ws",
          });
          props.setNewRequestBody({
            ...props.newRequestBody,
            bodyType: "none",
            bodyContent: "",
          });
          break;
      }
      default:
      }
  };

  return (
    <div className="composerContents is-hack-height">
      {/* DROPDOWN PROTOCOL SELECTOR */}

      {/* BULMA TAB */}
      < NetworkDropdown onProtocolSelect={onProtocolSelect} network={props.newRequestFields.network}/>

      {/* COMPOSER CONTENT ROUTING */}
      <Switch>
        <Route path="/compose-rest"> <RestContainer {...props} /> </Route>
        <Route path="/compose-grpc"> <GRPCContainer {...props} /> </Route>
        <Route path="/compose-graphql"> <GraphQLContainer {...props} /> </Route>
        <Route path="/compose-ws"> <WSContainer {...props} /> </Route>
        <Route path="/"> <RestContainer {...props} /> </Route>
      </Switch>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ComposerContainer);
