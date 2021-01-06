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
  scheduledReqResDelete: () => {
    dispatch(actions.scheduledReqResDelete());
  },
  clearAllGraph: () => {
    dispatch(actions.clearAllGraph());
  },
});

const StoppedContainer = (props) => {
  const { reqResArray, reqResDelete, reqResUpdate, runScheduledTests, scheduledReqResArray, scheduledReqResDelete, clearAllGraph } = props;
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
        <left style={{fontWeight: 'bold'}}>Queue</left>
        <right className='prettify-select'>
        <button
            className="button is-small is-danger is-outlined button-hover-color ml-3"
            onClick={() => {
              scheduledReqResDelete();
              clearAllGraph();
            }}
            >
              Clear
          </button>
        </right>
        {scheduledReqResMapped.reverse()}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StoppedContainer);
