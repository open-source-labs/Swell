import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import Tab from './Tab.jsx';

const mapStateToProps = store => ({ store });
const mapDispatchToProps = dispatch => ({});

class ResponseTabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const events = 'Response Events';
    const cookies = 'Response Cookies';
    const headers = 'Response Headers';

    return (
      <ul className="tab_list-response">
        <Tab onTabSelected={this.props.handleTabSelect} tabName={events} key="events" />
        <Tab onTabSelected={this.props.handleTabSelect} tabName={headers} key="headers" />
        <Tab onTabSelected={this.props.handleTabSelect} tabName={cookies} key="cookies" />
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseTabs);
