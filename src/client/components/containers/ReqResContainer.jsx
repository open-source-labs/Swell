import React, { useEffect } from "react";
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
  const { reqResArray, reqResDelete, reqResUpdate } = props;

  const reqResMapped = reqResArray.map((reqRes, index) => {
    return (
      <SingleReqResContainer
        className={`reqResChild`}
        content={reqRes}
        key={index}
        index={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
      />
    );
  });

  return (
    <div>
      <div>{reqResMapped.reverse()}</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReqResContainer);
