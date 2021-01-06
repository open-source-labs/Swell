import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import SingleScheduleReqResContainer from "./SingleScheduleReqResContainer.jsx";
import SingleReqResContainer from "./SingleReqResContainer.jsx";
import ReqResCtrl from "../../controllers/reqResController";

const mapStateToProps = (store) => ({
  reqResArray: store.business.reqResArray,
  scheduledReqResArray: store.business.scheduledReqResArray,
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

const StoppedContainer = (props) => {
  const { reqResArray, reqResDelete, reqResUpdate, runScheduledTests, scheduledReqResArray } = props;
  const dispatch = useDispatch();

  let scheduledReqResMapped = scheduledReqResArray.map((reqRes, index) => {
    return (
      <SingleScheduleReqResContainer
        className={`reqResChild`}
        content={reqRes}
        key={index}
        date={reqRes.response.headers.date[0]}
        index={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
      />
    );
  });

  return (
    <div>
       <div className='is-queue-color mx-1 py-1'>
        <center style={{fontWeight: 'bold', textDecoration: 'underline'}}>Queue</center>
        {scheduledReqResMapped.reverse()}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StoppedContainer);
