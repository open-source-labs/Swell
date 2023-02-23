import React from 'react';
import { connect, useSelector } from 'react-redux';

import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/reqRes/reqResSlice';

import SingleReqResContainer from './SingleReqResContainer';
import ReqResCtrl from '../../controllers/reqResController';
import { RootState } from '../../toolkit-refactor/store';

/**@todo change to use hooks? */
const mapStateToProps = (store: RootState) => ({
  reqResArray: store.reqRes.reqResArray,
});

/**@todo change to use hooks? */
const mapDispatchToProps = (dispatch) => ({
  reqResItemDeleted: (reqRes) => {
    dispatch(reqResItemDeleted(reqRes));
  },
  reqResUpdated: (reqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

const ReqResContainer = (props) => {
  const { reqResArray, reqResItemDeleted, updated, displaySchedule } = props;

  /**@todo maybe access functions (last two) directly from container instead of passing through props? */
  const reqResMapped = reqResArray.map((reqRes, index) => {
    return (
      <SingleReqResContainer
        className="reqResChild"
        content={reqRes}
        key={index}
        index={index}
        reqResItemDeleted={reqResItemDeleted}
        updated={updated}
      />
    );
  });

  const runCollectionTest = () => {
    ReqResCtrl.runCollectionTest(reqResArray);
  };
  const isDark = useSelector((store: RootState) => store.ui.isDark);

  return (
    <div>
      {reqResArray.length > 0 && displaySchedule && (
        <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
          <button
            className={`${
              isDark ? 'is-dark-200' : ''
            } button is-small is-rest-invert is-outlined button-padding-vertical button-hover-color`}
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
