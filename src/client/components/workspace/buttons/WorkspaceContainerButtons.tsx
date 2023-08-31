import React, { useState } from 'react';
import { useAppSelector } from '~/toolkit/store';
import ReqResCtrl from '../../../controllers/reqResController';
import WorkspaceCollectionsContainer from '../WorkspaceCollectionsContainer';
import SaveWorkspaceModal from '../modals/SaveWorkspaceModal';
// Import MUI components

export default function WorkspaceContainerButtons() {
  const [showModal, setShowModal] = useState(false);
  const isDark = useAppSelector((state) => state.ui.isDark);

  return (
    <div>
      {/* NAV BAR */}
      <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
        <button
          className={`button is-small is-danger ${
            isDark ? '' : 'is-outlined'
          } button-padding-vertical button-hover-color ml-3`}
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
          className={`button is-small is-primary ${
            isDark ? '' : 'is-outlined'
          } button-padding-verticals mr-3`}
          style={{ minWidth: '4vw' }}
          type="button"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Save or Create New Workspace
        </button>
      </div>

      <SaveWorkspaceModal showModal={showModal} setShowModal={setShowModal} />
      {/* REQUEST CARDS */}
      <WorkspaceCollectionsContainer displaySchedule />
    </div>
  );
}
