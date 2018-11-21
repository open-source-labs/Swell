import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

import Tab from './Tab.jsx';

const mapStateToProps = store => ({
  currentTab : store.business.currentTab,
});

const mapDispatchToProps = dispatch => ({
  setCurrentTab : (tab) => {
    dispatch(actions.setCurrentTab(tab));
  },
});

class TabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabArr : [],
      tabInput : "",
      invalidTabInput : false,
    }
    this.handleTabInput = this.handleTabInput.bind(this);
    this.addTab = this.addTab.bind(this);
  }

  componentDidMount () {
    let tabArrCopy = this.state.tabArr.slice();
    tabArrCopy.push('First Tab');

    this.setState({
      tabArr : tabArrCopy,
    });

    this.props.setCurrentTab('First Tab');
  }

  addTab () {
    if (this.state.tabInput === '') {
      this.setState({
        invalidTabInput : true,
      });
      return;
    }

    let tabArrCopy = this.state.tabArr.slice();
    tabArrCopy.push(this.state.tabInput);

    this.setState({
      tabArr : tabArrCopy,
      tabInput : "",
      invalidTabInput : false,
    })
  }

  handleTabInput (e) {
    this.setState ({
      tabInput : e.target.value,
    })
  }

  render() {
    let tabReactArr = this.state.tabArr.map((tab, index) => <Tab tabName={tab} key={index}></Tab>);

    let invalidDisplayStyles = {
      'display' : this.state.invalidTabInput ? 'block' : 'none',
      'color' : 'red',
    }

    return(
      <div style={{'border' : '1px solid black', }}>
        TabContainer

        <div style={invalidDisplayStyles}>Invalid tab input.</div>

        <input type='text' value={this.state.tabInput} onChange={this.handleTabInput} onKeyPress={event => {
        if (event.key === 'Enter') {
          this.addTab();
        }
        
      }}></input>

        <button onClick={this.addTab}>Add Tab</button>

        {tabReactArr}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabContainer);