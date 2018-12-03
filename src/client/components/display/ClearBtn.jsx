import React from 'react';
import ReqResCtrl from '../../controllers/connectionController';

const ClearBtn = () => (
  <button className="btn" type="button" onClick={ReqResCtrl.clearAllReqRes}>
      Clear All
  </button>
);

export default ClearBtn;
