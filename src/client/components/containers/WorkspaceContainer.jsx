import React, { useState } from "react";

import ReqResCtrl from "../../controllers/reqResController.js";
import SaveWorkspaceModal from './SaveWorkspaceModal'
import ReqResContainer from "./ReqResContainer.jsx";

export default function WorkspaceContainer() {

  // LOCAL STATE HOOKS
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* NAV BAR */}
      <div className="is-flex is-flex-direction-row is-justify-content-flex-end is-align-items-center mt-3">
        <button
          className="button is-small is-outlined button-padding-vertical button-hover-color"
          type="button"
          onClick={ReqResCtrl.clearAllReqRes}
        >
          Clear Workspace
        </button>

        <button
          className="button is-small is-primary is-outlined button-padding-verticals mx-3"
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
