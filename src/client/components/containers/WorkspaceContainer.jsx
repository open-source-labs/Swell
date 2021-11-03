import React, { useState } from 'react';
import ReqResCtrl from '../../controllers/reqResController';
import ReqResContainer from './ReqResContainer.jsx';
import SaveWorkspaceModal from './SaveWorkspaceModal';

function WorkspaceContainer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* NAV BAR */}
      <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
        <button
          className="button is-small is-danger is-outlined button-padding-vertical button-hover-color ml-3"
          style={{ minWidth: '14vw' }}
          type="button"
          onClick={() => {
            ReqResCtrl.clearAllReqRes();
            ReqResCtrl.clearAllGraph();
          }}
        >
          Clear Workspace
        </button>

        <button
          className="button is-small is-primary is-outlined button-padding-verticals mr-3"
          style={{ minWidth: '14vw' }}
          type="button"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Save Workspace
        </button>
      </div>

      <SaveWorkspaceModal showModal={showModal} setShowModal={setShowModal} />
      {/* REQUEST CARDS */}
      <ReqResContainer displaySchedule />
    </div>
  );
}

export default WorkspaceContainer;
