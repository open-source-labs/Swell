import React, { Component } from 'react';
import Tab from './Tab.jsx';

class ResponseTabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('THETSHESTRKSDFKJHS', this.props.content)
    const events = 'Response Events';
    const cookies = 'Response Cookies';
    let headers = 'Response Headers';

    if (this.props.content.gRPC === true ) {
      headers = 'Response Metadata';
    }
    return (
      <ul className="tab_list-response">
        <Tab onTabSelected={this.props.handleTabSelect} tabName={events} key="events" openTab={this.props.openResponseTab}/>
        <Tab onTabSelected={this.props.handleTabSelect} tabName={headers} key="headers" openTab={this.props.openResponseTab}/>
        {
          !this.props.responseContent.bodyType === "GRPC" &&
          <Tab onTabSelected={this.props.handleTabSelect} tabName={cookies} key="cookies" openTab={this.props.openResponseTab}/>
        }
        </ul>
    );
  }
}

export default ResponseTabs;


