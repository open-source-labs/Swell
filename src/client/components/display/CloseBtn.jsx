import React from 'react';
import ReqResCtrl from '../../controllers/reqResController';

const CloseBtn = props => (
  <button
    className="btn"
    style={props.stylesObj}
    type="button"
    onClick={() => ReqResCtrl.closeReqRes(props.content.id)}
  >
      Close
  </button>
);

export default CloseBtn;
