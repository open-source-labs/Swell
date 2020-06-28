import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";

import ComposerNewRequest from "./NewRequest/ComposerNewRequest.jsx";
import ComposerWarning from "./Warning/ComposerWarning.jsx";

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

class ComposerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.setState({
    //   composerDisplay: this.props.composerDisplay,
    // });
  }

  componentDidUpdate() {
    //keeping the redux store state in sync with this component's local state
    // if (this.props.composerDisplay !== this.state.composerDisplay) {
    //   this.setState({
    //     composerDisplay: this.props.composerDisplay,
    //   });
    // }
  }

  render() {
    let composerContents;
    switch (
      this.props.composerDisplay // conditional rendering of components based on the value of composerDisplay in redux store
    ) {
      case "Request": {
        composerContents = (
          <ComposerNewRequest
            composerDisplay={this.props.composerDisplay}
            newRequestFields={this.props.newRequestFields}
            newRequestHeaders={this.props.newRequestHeaders}
            newRequestStreams={this.props.newRequestStreams}
            newRequestCookies={this.props.newRequestCookies}
            newRequestBody={this.props.newRequestBody}
            newRequestSSE={this.props.newRequestSSE}
            currentTab={this.props.currentTab}
            reqResAdd={this.props.reqResAdd}
            setComposerWarningMessage={this.props.setComposerWarningMessage}
            setComposerDisplay={this.props.setComposerDisplay}
            setNewRequestFields={this.props.setNewRequestFields}
            setNewRequestHeaders={this.props.setNewRequestHeaders}
            setNewRequestStreams={this.props.setNewRequestStreams}
            setNewRequestCookies={this.props.setNewRequestCookies}
            setNewRequestBody={this.props.setNewRequestBody}
            setNewRequestSSE={this.props.setNewRequestSSE}
          />
        );
        break;
      }
      case "Warning": {
        composerContents = (
          <ComposerWarning
            warningMessage={this.props.warningMessage}
            setComposerDisplay={this.props.setComposerDisplay}
          />
        );
        break;
      }
      default:
        console.log("Incorrect Model Display setting");
    }
    return <div className="composerContents">{composerContents}</div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposerContainer);
