import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/reqRes/reqResSlice';

import SingleScheduleReqResContainer from './SingleScheduleReqResContainer';
import ReqResCtrl from '../../controllers/reqResController';

/**@todo switch to use hooks? */
const mapStateToProps = (store) => ({
  reqResArray: store.reqRes.reqResArray,
  scheduledReqResArray: store.scheduledReqRes,
});

/**@todo switch to use hooks? */
const mapDispatchToProps = (dispatch) => ({
  reqResItemDeleted: (reqRes) => {
    dispatch(reqResItemDeleted(reqRes));
  },
  reqResUpdated: (reqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

const ScheduleReqResContainer = (props) => {
  const {
    reqResArray,
    reqResItemDeleted,
    updated,
    scheduleInterval,
    scheduledReqResArray,
  } = props;

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < reqResArray.length; i++) {
        ReqResCtrl.openScheduledReqRes(reqResArray[i].id);
      }
    }, scheduleInterval * 1000);
    return () => clearInterval(interval);
  }, [reqResArray, scheduleInterval]);

  /**@todo maybe access functions (last two) directly from container instead of passing through props? */
  const scheduledReqResMapped = scheduledReqResArray.map((reqRes, index) => {
    return (
      <SingleScheduleReqResContainer
        className="reqResChild"
        content={reqRes}
        date={reqRes.response.headers.date[0]}
        key={index}
        index={index}
        reqResItemDeleted={reqResItemDeleted}
        updated={updated}
      />
    );
  });

  return (
    <div>
      <div className="no-styling mx-1 py-1 is-flex is-flex-direction-column">
        <center className="queue">Scheduled Requests</center>
        {scheduledReqResMapped.reverse()}
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleReqResContainer);
