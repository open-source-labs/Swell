import React, { Component } from "react";
import ResponseTabs from "../display/ResponseTabs.jsx";
import ResponseEventsDisplay from "../display/ResponseEventsDisplay.jsx";
import ResponseHeadersDisplay from "../display/ResponseHeadersDisplay.jsx";
import ResponseCookiesDisplay from "../display/ResponseCookiesDisplay.jsx";
import ResponseSubscriptionDisplay from "../display/ResponseSubscriptionDisplay.jsx";

class ResponseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTab: "Response Events",
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  componentDidMount() {
    if (this.state.responseDisplay !== this.props.connectionType) {
      this.setState({
        responseDisplay: this.props.connectionType,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.responseDisplay !== this.props.connectionType) {
      this.setState({
        responseDisplay: this.props.connectionType,
      });
    }
  }

  handleTabSelect(val) {
    switch (val) {
      case "Response Cookies":
        this.setState({
          openTab: val,
        });
        break;
      case "Response Metadata":
        this.setState({
          openTab: val,
        });
        break;
      case "Response Headers":
        this.setState({
          openTab: val,
        });
        break;
      case "Response Events":
        this.setState({
          openTab: val,
        });
        break;

      default:
    }
  }

  render() {
    return (
      <div className="resreq_res-container">
        <ResponseTabs
          content={this.props.content}
          responseContent={this.props.content.response}
          handleTabSelect={this.handleTabSelect}
          openResponseTab={this.state.openTab}
        />
        {this.state.openTab === "Response Events" &&
          this.props.content.request.method === "SUBSCRIPTION" && (
            <ResponseSubscriptionDisplay
              content={this.props.content}
              reqResUpdate={this.props.reqResUpdate}
            />
          )}
        {this.state.openTab === "Response Events" &&
          this.props.content.request.method !== "SUBSCRIPTION" && (
            <ResponseEventsDisplay response={this.props.content.response} />
          )}
        {this.state.openTab === "Response Headers" && (
          <ResponseHeadersDisplay
            tabName={this.state.openTab}
            responseContent={this.props.content.response}
          />
        )}
        {this.state.openTab === "Response Metadata" && (
          <ResponseHeadersDisplay
            tabName={this.state.openTab}
            responseContent={this.props.content.response}
          />
        )}
        {this.state.openTab === "Response Cookies" && (
          <ResponseCookiesDisplay
            responseContent={this.props.content.response}
          />
        )}
      </div>
    );
  }
}

export default ResponseContainer;
