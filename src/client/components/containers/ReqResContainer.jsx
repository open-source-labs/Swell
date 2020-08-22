import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";
import SingleReqResContainer from "./SingleReqResContainer.jsx";

const mapStateToProps = (store) => ({
  reqResArray: store.business.reqResArray,
  currentTab: store.business.currentTab,
});

const mapDispatchToProps = (dispatch) => ({
  reqResDelete: (reqRes) => {
    dispatch(actions.reqResDelete(reqRes));
  },
  reqResUpdate: (reqRes) => {
    dispatch(actions.reqResUpdate(reqRes));
  },
});

const ReqResContainer = (props) => {
  const {
    reqResArray,
    reqResDelete,
    reqResUpdate,
  } = props;

  const reqResMapped = reqResArray.map((reqRes, index) => {
    return (
      <SingleReqResContainer
        className="reqResChild"
        content={reqRes}
        key={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
      />
    );
  });

  return (
    <div id="reqResContainer">
      <div id="reqResContainer_inner">{reqResMapped.reverse()}</div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
  (ReqResContainer);
