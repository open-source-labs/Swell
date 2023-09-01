// This is a legacy state management compoonent that need to
// be migrated to the RTK slice??

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../rtk/store';
import { reqResItemDeleted } from '../../rtk/slices/reqResSlice';

import WorkspaceCollectionElement from './WorkspaceCollectionElement';
import ReqResCtrl from '~/controllers/reqResController';
import { ReqRes } from '~/types';

type Props = {
  displaySchedule: boolean;
};

const WorkspaceCollectionsContainer = ({ displaySchedule }: Props) => {
  const reqResArray = useAppSelector((store) => store.reqRes.reqResArray);
  const isDark = useAppSelector((store) => store.ui.isDark);
  const dispatch = useAppDispatch();

  const runCollectionTest = () => {
    ReqResCtrl.runCollectionTest(reqResArray);
  };

  const deleteReqRes = (reqRes: ReqRes) => {
    dispatch(reqResItemDeleted(reqRes));
  };

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

      <div>
        {reqResArray
          .map((reqRes, index) => (
            <WorkspaceCollectionElement
              key={index}
              className="reqResChild"
              content={reqRes}
              index={index}
              reqResItemDeleted={deleteReqRes}
            />
          ))
          .reverse()}
      </div>
    </div>
  );
};

export default WorkspaceCollectionsContainer;
