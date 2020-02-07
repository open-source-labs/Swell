import React, { Component } from "react";
import Tab from "./Tab.jsx";

class RequestTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTab: "",
      tabContentShown: []
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  handleTabSelect(val) {
    let headers = "Request Headers"
    if (this.props.requestContent.bodyType === 'GRPC') {
      headers = "Request Metadata"
    }

    switch (val) {
      case "Request Body":
        this.setState({
          openTab: val
        });
        break;
      case "Request Variables":
        this.setState({
          openTab: val
        });
        break;
      case "Request Cookies":
        this.setState({
          openTab: val
        });
        break;
      case headers:
        this.setState({
          openTab: val
        });
        break;
      default:
    }
  }

  componentDidMount() {
    this.handleTabSelect("Request Body");
  }

  render() {
    let body = "Request Body";
    let cookies = 'Request Cookies';
    let headers = "Request Headers";
    let variables = "Request Variables";
    let tabContentShown;

    if (this.props.requestContent.bodyType === 'GRPC') {
      headers = "Request Metadata"
    }
    
    // let displayQueries = this.props.requestContent.body;
    // if (this.props.requestContent.bodyType === 'GRPC') {
    //   displayQueries = '';
    //   let length = this.props.requestContent.streams.length;
    //   for (let i = 0; i < length; i += 1) {
    //     if (i > 0) {
    //       displayQueries += '\n\n'
    //     }
    //     let streamObj = this.props.requestContent.streams[i];
    //     displayQueries += streamObj.query;
    //   }
    // }
 
    if (this.state.openTab === "Request Body") {
      tabContentShown = !!this.props.requestContent.body
        ? <pre><p className="reqResContent info" key={`reqResContent${this.props.requestContent.id}`} >{this.props.requestContent.body}</p></pre>
        : <p className="reqResContent" key={`reqResContent${this.props.requestContent.id}`} >No Request Body</p>
    }

    else if (this.state.openTab === "Request Variables") {
      tabContentShown = !!this.props.requestContent.bodyVariables
        ? <pre><p className="reqResContent info" key={`reqResContent${this.props.requestContent.id}`} >{this.props.requestContent.bodyVariables}</p></pre>
        : <p className="reqResContent" key={`reqResContent${this.props.requestContent.id}`} >No Request Variables</p>
    }

    else if (this.state.openTab === headers) {
      tabContentShown = [];
      if (this.props.requestContent.headers && this.props.requestContent.headers.length > 0) {
        this.props.requestContent.headers.forEach((cur, idx) => {
          tabContentShown.push(
            <div className={"grid-2"} key={idx}>
              <span className={"tertiary-title title_offset"}>{cur.key}</span>
              <span className={"tertiary-title title_offset"}>{cur.value}</span>
            </div>
          );
        });
      }
      else {
      tabContentShown.push(<p className="reqResContent" key={`reqResContent${this.props.requestContent.id}`} >No {headers}</p>)
      }
    }

    else if (this.state.openTab === "Request Cookies") {
      tabContentShown = [];
      if (this.props.requestContent.cookies && this.props.requestContent.cookies.length > 0) {
        this.props.requestContent.cookies.forEach((cur, idx) => {
          tabContentShown.push(
            <div className={"grid-2"} key={idx}>
              <span className={"tertiary-title title_offset"}>{cur.key}</span>
              <span className={"tertiary-title title_offset"}>{cur.value}</span>
            </div>
          );
        });
      }
      else {
        tabContentShown.push(<p className="reqResContent" key={`reqResContent${this.props.requestContent.id}`}>No Request Cookies</p>)
      }
    }
    
    return (
      <div className={"request_tabs_container"}>
        <ul className={"tab_list"}>
          <Tab onTabSelected={this.handleTabSelect} tabName={body} openTab={this.state.openTab} />
          <Tab onTabSelected={this.handleTabSelect} tabName={headers} openTab={this.state.openTab} />
          {
            this.props.requestContent.bodyType === "none" &&
            <Tab onTabSelected={this.handleTabSelect} tabName={cookies} openTab={this.state.openTab} />
          }
          {
            this.props.requestContent.bodyType === "GQL" &&
            <Tab onTabSelected={this.handleTabSelect} tabName={cookies} openTab={this.state.openTab} />
          }
          {
            this.props.requestContent.bodyType === "GQL" &&
            <Tab onTabSelected={this.handleTabSelect} tabName={variables} openTab={this.state.openTab} />
          }
        </ul>
        <div className={"tab_content"}>{tabContentShown}</div>
      </div>
    );
  }
}

export default RequestTabs;
