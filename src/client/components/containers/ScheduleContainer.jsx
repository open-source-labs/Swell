import React, { useState } from "react";

import ReqResCtrl from "../../controllers/reqResController.js";
import SaveWorkspaceModal from "./SaveWorkspaceModal";
import ScheduleReqResContainer from "./ScheduleReqResContainer.jsx";

export default function ScheduleContainer() {
  return (
    <div>
      <ScheduleReqResContainer />
    </div>
  );
}
