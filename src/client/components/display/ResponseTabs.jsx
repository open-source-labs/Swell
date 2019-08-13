import React, { Component } from 'react';
import Tab from './Tab.jsx';

class ResponseTabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const events = 'Response Events';
    const cookies = 'Response Cookies';
    const headers = 'Response Headers';
    const batchlog = 'Batch Log'
    const isBatch = this.props.content.protocol === "https://" && this.props.content.isThisBatchCall
    return (
      <ul className="tab_list-response">
        <Tab onTabSelected={this.props.handleTabSelect} tabName={events} key="events" openTab={this.props.openResponseTab}/>
        <Tab onTabSelected={this.props.handleTabSelect} tabName={headers} key="headers" openTab={this.props.openResponseTab}/>
        <Tab onTabSelected={this.props.handleTabSelect} tabName={cookies} key="cookies" openTab={this.props.openResponseTab}/>
        {isBatch ? <Tab onTabSelected={this.props.handleTabSelect} tabName={batchlog} key="batchlog" openTab={this.props.openResponseTab}/> : <></>}
      </ul>
    );
  }
}

export default ResponseTabs;
