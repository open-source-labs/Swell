import React, { Component } from "react";
import { connect } from "react-redux";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedDark } from 'react-syntax-highlighter/styles/hljs';
import pretty from 'pretty';

import * as actions from "../../actions/actions";

import Tab from "./Tab.jsx";
import SSERow from "./SSERow.jsx";
import ResponsePlain from "./ResponsePlain.jsx";

const mapStateToProps = store => ({
  store: store
});

const mapDispatchToProps = dispatch => ({});

class ResponseTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTabs: "",
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  handleTabSelect(val) {
    // console.log("handleTabSelect");
    switch (val) {
      case "Cookies":
        this.setState({
          openTabs: val,
        });
        break;
      case "Headers":
        this.setState({
          openTabs: val,
        });
        break;
      case "Events":
        this.setState({
          openTabs: val,
        });
        break;
      default:
        // console.log(`There was an error with ${val}`);
    }
  }

  componentDidMount() {
    this.handleTabSelect("Events");
  }

  render() {
    let events = "Events";
    // let cookies = "Cookies";
    let headers = "Headers";
    let tabContentShown;
    let tabContentShownEvents = [];

    if (this.state.openTabs === "Events" && this.props.responseContent.events) {
        tabContentShown = this.props.responseContent.events;
        tabContentShown.forEach((cur, idx) => {
            if (this.props.store.business.reqResArray[0].connectionType === 'SSE') {
                console.log('TESTING 1')
                tabContentShownEvents.push(<SSERow key={idx} content={cur} />);
            } else if (this.props.store.business.reqResArray[0].connectionType === 'plain') {
                console.log('TESTING 2')
                tabContentShownEvents.push(
                    <SyntaxHighlighter key={idx} language='htmlbars' style={solarizedDark}>
                        {pretty(cur, {ocd: true})}
                    </SyntaxHighlighter>          
                )
            }
        });
    }

    if (this.state.openTabs === "Headers") {
      let headerObj = this.props.responseContent.headers;

      if (!Array.isArray(headerObj) && headerObj) {
        for (let key in headerObj) {
          tabContentShownEvents.push(
            <div className={"nested-grid-2"}>
              <span className={"tertiary-title title_offset"}>{key}</span>
              <span className={"tertiary-title title_offset"}>
                {headerObj[key]}
              </span>
            </div>
          );
        }
      }
    }

    return (
      <div>
        <ul className={"tab_list"}>
          <Tab onTabSelected={this.handleTabSelect} tabName={events} />
          {/* <Tab onTabSelected={this.handleTabSelect} tabName={cookies} /> */}
          <Tab onTabSelected={this.handleTabSelect} tabName={headers} />
        </ul>
        <div className={"tab_content"}>{tabContentShownEvents}</div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResponseTabs);
