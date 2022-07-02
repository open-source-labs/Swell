import React, { useEffect } from 'react';
import { connect } from 'react-redux';

/**@todo delete when slice conversion complete */
import * as actions from '../../features/business/businessSlice';

import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/reqRes/reqResSlice';

import SingleScheduleReqResContainer from './SingleScheduleReqResContainer';
import ReqResCtrl from '../../controllers/reqResController';

/**@todo switch to use hooks? */
const mapStateToProps = (store) => ({
  reqResArray: store.business.reqResArray,
  scheduledReqResArray: store.business.scheduledReqResArray,
  currentTab: store.business.currentTab,
});

/**@todo switch to use hooks? */
const mapDispatchToProps = (dispatch) => ({
  itemDeleted: (reqRes) => {
    dispatch(reqResItemDeleted(reqRes));
  },
  updated: (reqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

const ScheduleReqResContainer = (props) => {
  const {
    reqResArray,
    itemDeleted,
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
        itemDeleted={itemDeleted}
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
