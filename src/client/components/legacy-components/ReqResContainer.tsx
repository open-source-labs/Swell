import React from 'react';
import { connect, useSelector } from 'react-redux';
import * as actions from '../../features/business/businessSlice';
import SingleReqResContainer from './SingleReqResContainer';
import ReqResCtrl from '../../controllers/reqResController';

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
  const { reqResArray, reqResDelete, reqResUpdate, displaySchedule } = props;

  const reqResMapped = reqResArray.map((reqRes, index) => {
    return (
      <SingleReqResContainer
        className="reqResChild"
        content={reqRes}
        key={index}
        index={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
      />
    );
  });

  const runCollectionTest = () => {
    ReqResCtrl.runCollectionTest(reqResArray);
  };
  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div>
      {reqResArray.length > 0 && displaySchedule && (
        <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
          <button
            className={`${isDark ? 'is-dark-200' : ''} button is-small is-rest-invert is-outlined button-padding-vertical button-hover-color`}
            type="button"
            onClick={runCollectionTest}
          >
            Send Collection
          </button>
        </div>
      )}

      <div>{reqResMapped.reverse()}</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReqResContainer);
