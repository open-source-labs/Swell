import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import ReqResCtrl from '../../../controllers/reqResController';
import WorkspaceCollectionsContainer from '../WorkspaceCollectionsContainer';
import SaveWorkspaceModal from '../modals/SaveWorkspaceModal';
// Import MUI components

export default function WorkspaceContainerButtons () {
  const [showModal, setShowModal] = useState(false);
  const isDark = useAppSelector((store: { ui: { isDark: boolean }}) => store.ui.isDark);

  return (
    <div>
      {/* NAV BAR */}
      <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
        <button
          className={`button is-small is-danger ${isDark ? 'is-dark-300' : 'is-outlined'} button-padding-vertical button-hover-color ml-3`}
          style={{ minWidth: '4vw' }}
          type="button"
          onClick={() => {
            ReqResCtrl.clearAllReqRes();
            ReqResCtrl.clearAllGraph();
          }}
        >
          Clear Workspace
        </button>

        <button
          className={`button is-small ${isDark ? 'is-dark-300' : 'is-outlined'} is-primary button-padding-verticals button-hover-color mr-3`}
          style={{ minWidth: '4vw' }}
          type="button"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Save or Create New Workspace
        </button>
      </div>

      <SaveWorkspaceModal showModal={showModal} setShowModal={setShowModal}/>
      {/* REQUEST CARDS */}
      <WorkspaceCollectionsContainer displaySchedule />
    </div>
  );
}