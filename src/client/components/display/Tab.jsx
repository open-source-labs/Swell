/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.tabClickHandler = this.tabClickHandler.bind(this);
  }

  tabClickHandler() {
    const selectedTab = this.props.tabName;
    this.props.onTabSelected(selectedTab);
  }

  render() {
    return (
      <li
        onClick={this.tabClickHandler}
        className={
          this.props.tabName === this.props.openTab
            ? 'tab-list-item-active'
            : 'tab-list-item'
        }
        key={this.props.tabName}
      >
        {this.props.tabName}
      </li>
    );
  }
}

export default Tab;
