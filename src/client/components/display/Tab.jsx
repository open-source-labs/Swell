import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
  currentTab: store.business.currentTab,
});

const mapDispatchToProps = dispatch => ({
  setCurrentTab: (tab) => {
    dispatch(actions.setCurrentTab(tab));
  },
});

class Tab extends Component {
  constructor(props) {
    super(props);
    this.setThisTabAsCurrentTab = this.setThisTabAsCurrentTab.bind(this);
  }

  setThisTabAsCurrentTab() {
    if (this.props.currentTab !== this.props.tabName) {
      this.props.setCurrentTab(this.props.tabName);
    }
  }

  render() {
    const buttonStyles = {
      color: this.props.currentTab === this.props.tabName ? 'red' : 'black',
      border: '1px solid black',
      cursor: 'pointer',
    };
    return (
      <div>
        <button style={buttonStyles} onClick={this.setThisTabAsCurrentTab} type="button">
          {this.props.tabName}
        </button>
      </div>
    );
  }
}

Tab.propTypes = {
  tabName: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tab);
