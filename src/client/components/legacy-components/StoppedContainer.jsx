import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

/**@todo delete after slice convserion complete */
//import * as actions from '../../features/business/businessSlice';

import { graphCleared } from '../../toolkit-refactor/graphPoints/graphPointsSlice';
import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/reqRes/reqResSlice';
import { scheduledReqResCleared } from '../../toolkit-refactor/scheduledReqRes/scheduledReqResSlice';

import SingleScheduleReqResContainer from './SingleScheduleReqResContainer';

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
  scheduledReqResCleared: () => {
    dispatch(scheduledReqResCleared());
  },
  graphCleared: () => {
    dispatch(graphCleared());
  },
});

const StoppedContainer = (props) => {
  const {
    reqResArray,
    itemDeleted,
    updated,
    runScheduledTests,
    scheduledReqResArray,
    scheduledReqResCleared,
    graphCleared,
  } = props;
  const dispatch = useDispatch();

  /**@todo maybe access functions (last two) directly from container instead of passing through props? */
  const scheduledReqResMapped = scheduledReqResArray.map((reqRes, index) => {
    return (
      <SingleScheduleReqResContainer
        className="reqResChild"
        content={reqRes}
        key={index}
        date={reqRes.response.headers.date[0]}
        index={index}
        itemDeleted={itemDeleted}
        updated={updated}
      />
    );
  });

  const isDark = useSelector((state) => state.ui.isDark);

  return (
    <>
      <div className="no-styling mx-1 py-1 is-flex is-flex-direction-column">
        <center className="queue">Scheduled Requests</center>
        <div className="prettify-select is-align-self-center mt-3 mb-3">
          <button
            className={`button is-small is-danger ${
              isDark ? '' : 'is-outlined'
            } button-hover-color`}
            style={{ width: '190px' }}
            onClick={() => {
              scheduledReqResCleared();
              graphCleared();
            }}
          >
            Clear
          </button>
        </div>
        {scheduledReqResMapped.reverse()}
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StoppedContainer);
