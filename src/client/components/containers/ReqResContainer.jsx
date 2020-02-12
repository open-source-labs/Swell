import React, { Component } from "react";
import * as actions from '../../actions/actions';
import { connect } from "react-redux";
import SingleReqResContainer from "./SingleReqResContainer.jsx";

const mapStateToProps = store => ({
  reqResArray: store.business.reqResArray,
  currentTab: store.business.currentTab,
});

const mapDispatchToProps = dispatch => ({
  reqResDelete: (reqRes) => {
    dispatch(actions.reqResDelete(reqRes));
  },
  reqResUpdate: (reqRes) => {
    dispatch(actions.reqResUpdate(reqRes));
  },
});

class ReqResContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.reqResArray)
    const reqResArr = this.props.reqResArray
      .map((reqRes, index) => {
        return <SingleReqResContainer
          className="reqResChild"
          content={reqRes}
          key={index}
          reqResDelete={this.props.reqResDelete}
          reqResUpdate={this.props.reqResUpdate}
        />;
      });

    return (
      <div id="reqResContainer">
        <div id='reqResContainer_inner' >
          {reqResArr}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReqResContainer);
