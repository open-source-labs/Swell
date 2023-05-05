// This is a legacy state management compoonent that need to
// be migrated to the RTK slice?? 

import React from 'react';
import { connect, useSelector } from 'react-redux';

import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/slices/reqResSlice';

import SingleReqResContainer from './CollectionElementContainer';
import ReqResCtrl from '../../controllers/reqResController';
import { RootState, AppDispatch } from '../../toolkit-refactor/store';
import { ReqRes, $TSFixMe  } from '../../../types';

/**@todo change to use hooks? */
const mapStateToProps = (store: RootState) => ({
  reqResArray: store.reqRes.reqResArray,
});

/**@todo change to use hooks? */
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  reqResItemDeleted: (reqRes: ReqRes) => {
    dispatch(reqResItemDeleted(reqRes));
  },
  reqResUpdated: (reqRes: ReqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

const ReqResContainer = (props: $TSFixMe) => {
  const { reqResArray, reqResItemDeleted, updated, displaySchedule } = props;

  /**@todo maybe access functions (last two) directly from container instead of passing through props? */
  const reqResMapped = reqResArray.map((reqRes: ReqRes, index: $TSFixMe) => {
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
