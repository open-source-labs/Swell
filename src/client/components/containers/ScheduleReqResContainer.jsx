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

const ScheduleReqResContainer = (props) => {
  const { reqResArray, reqResDelete, reqResUpdate, scheduleInterval, runScheduledTests, scheduledReqResArray } = props;
  const dispatch = useDispatch();
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(-1);

  let reqResMapped = reqResArray.map((reqRes, index) => {
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
  reqResMapped = reqResMapped.reverse();

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx(idx => idx + 1);
      for (let i = 0; i < reqResArray.length; i++) {
        ReqResCtrl.openScheduledReqRes(reqResArray[i].id);
      }
    }, scheduleInterval*1000);
    return () => clearInterval(interval);
  }, []);

  let scheduledReqResMapped = scheduledReqResArray.map((reqRes, index) => {
    return (
      <SingleScheduleReqResContainer
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
      <div>{reqResMapped}</div>
      <div> <p>Queue:</p>
      {scheduledReqResMapped}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleReqResContainer);
