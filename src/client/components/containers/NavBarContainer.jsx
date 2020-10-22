import React, { useState } from "react";

import ReqResCtrl from "../../controllers/reqResController.js";
import SaveWorkspaceModal from './SaveWorkspaceModal'
import ReqResContainer from "./ReqResContainer.jsx";

export default function NavBarContainer() {

  // LOCAL STATE HOOKS
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* NAV BAR */}
      <div className="columns mr-9">
        <button
          className="button is-small is-primary is-outlined column"
          type="button"
          onClick={ReqResCtrl.clearAllReqRes}
        >
          Clear Workspace
        </button>

        <button
          className="button is-small is-primary is-outlined column"
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
