import React, { useState } from "react";
import { useRouteMatch } from 'react-router-dom';

import ReqResCtrl from "../../controllers/reqResController.js";
import SaveWorkspaceModal from './SaveWorkspaceModal'

export default function NavBarContainer() {

  // LOCAL STATE HOOKS
  const [showModal, setShowModal] = useState(false);

  return (
    <div>

      <button
        className="btn save-btn"
        type="button"
        onClick={() => { setShowModal(true) } }
      >Save Collection
      </button>

      < SaveWorkspaceModal
        showModal = {showModal}
        setShowModal = {setShowModal}
      />

      <button
        className="btn"
        type="button"
        onClick={ReqResCtrl.clearAllReqRes}
      >Clear Requests
      </button>

    </div>
  )
}
