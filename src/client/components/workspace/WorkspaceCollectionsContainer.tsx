// This is a legacy state management compoonent that need to
// be migrated to the RTK slice?? 

import React from 'react';
import { connect } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../toolkit-refactor/hooks';

import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/slices/reqResSlice';

import WorkspaceCollectionElement from './WorkspaceCollectionElement';
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

const WorkspaceCollectionsContainer = (props: $TSFixMe) => {
  const { reqResArray, reqResItemDeleted, updated, displaySchedule } = props;

  /**@todo maybe access functions (last two) directly from container instead of passing through props? */
  const reqResMapped = reqResArray.map((reqRes: ReqRes, index: $TSFixMe) => {
    return (
      <WorkspaceCollectionElement
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
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

  return (
    <div>
      {reqResArray.length > 0 && displaySchedule && (
        <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
          <button
            className={`button is-small ${isDark ? 'is-dark-300' : 'is-outlined'} is-primary button-padding-verticals mr-3`}
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceCollectionsContainer);
