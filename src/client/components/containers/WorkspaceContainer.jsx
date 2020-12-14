import React, { useState } from "react";

import ReqResCtrl from "../../controllers/reqResController.js";
import SaveWorkspaceModal from "./SaveWorkspaceModal";
import ReqResContainer from "./ReqResContainer.jsx";

export default function WorkspaceContainer() {
  // LOCAL STATE HOOKS
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* NAV BAR */}
      <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
        <button
          className="button is-small is-danger is-outlined button-padding-vertical button-hover-color ml-3"
          style={{minWidth: '14vw'}}
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
          style={{minWidth: '14vw'}}
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
      <ReqResContainer />
    </div>
  );
}
