import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../features/business/businessSlice';
import * as uiactions from '../../features/ui/uiSlice';
import SingleScheduleReqResContainer from './SingleScheduleReqResContainer';

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
  const {
    reqResArray,
    reqResDelete,
    reqResUpdate,
    runScheduledTests,
    scheduledReqResArray,
    scheduledReqResDelete,
    clearAllGraph,
  } = props;
  const dispatch = useDispatch();

  const scheduledReqResMapped = scheduledReqResArray.map((reqRes, index) => {
    return (
      <SingleScheduleReqResContainer
        className="reqResChild"
        content={reqRes}
        key={index}
        date={reqRes.response.headers.date[0]}
        index={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
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
            className={`button is-small is-danger ${isDark ? '' : 'is-outlined' } button-hover-color`}
            style={{width: '190px'}}
            onClick={() => {
              scheduledReqResDelete();
              clearAllGraph();
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
