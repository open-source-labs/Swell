import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: '',
    };
    this.tabClickHandler = this.tabClickHandler.bind(this);
  }

  tabClickHandler () {
    // console.log('TabClick')
    let selectedTab = this.props.tabName;
    // console.log(selectedTab);
    this.props.onTabSelected(selectedTab);            
  }

  render() {
    return(
      <li onClick={this.tabClickHandler} className={'tab-list-item'}>{this.props.tabName}</li>
    )
  }
}


export default (Tab);
