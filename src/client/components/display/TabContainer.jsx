// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import * as actions from '../../actions/actions';

// import Tab from './Tab.jsx';

// const mapStateToProps = store => ({
//   currentTab: store.business.currentTab,
// });

// const mapDispatchToProps = dispatch => ({
//   setCurrentTab: (tab) => {
//     dispatch(actions.setCurrentTab(tab));
//   },
// });

// class TabContainer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tabArr: [],
//       newTabCounter: 1,
//     };
//     this.handleTabInput = this.handleTabInput.bind(this);
//     this.addTab = this.addTab.bind(this);
//   }

//   componentDidMount() {
//     this.addTab();
//     this.props.setCurrentTab('Tab 1');
//   }

//   addTab() {
//     // const tabArrCopy = this.state.tabArr.slice();
//     const tabArrCopy = this.setState({
//       tabArr: tabArr.slice(),
//     });
//     tabArrCopy.push(`Tab ${this.state.newTabCounter}`);

//     this.setState({
//       tabArr: tabArrCopy,
//       newTabCounter: newTabCounter + 1,
//     });
//   }

//   handleTabInput(e) {
//     this.setState({
//       tabInput: e.target.value,
//     });
//   }

//   render() {
//     const tabReactArr = this.state.tabArr.map((tab, index) => <Tab tabName={tab} key={index} />);

//     const invalidDisplayStyles = {
//       display: this.state.invalidTabInput ? 'block' : 'none',
//       color: 'red',
//     };

//     return (
//       <div style={{ display: 'flex' }}>
//         <div style={invalidDisplayStyles}>Invalid tab input.</div>

//         {tabReactArr}
//         <button onClick={this.addTab} type="button">Add Tab</button>
//       </div>
//     );
//   }
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(TabContainer);
