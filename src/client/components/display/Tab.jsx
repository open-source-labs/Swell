import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.tabClickHandler = this.tabClickHandler.bind(this);
  }

  tabClickHandler () {
    let selectedTab = this.props.tabName;
    this.props.onTabSelected(selectedTab);        
  }

  render() {
    return (
      <li onClick={this.tabClickHandler} className={this.props.tabName === this.props.openTab ? 'tab-list-item-active': 'tab-list-item'} key={this.props.tabName}>{this.props.tabName}</li>
    )
  }
}


export default (Tab);
