import React from 'react';
import ReqResCtrl from '../../controllers/reqResController';

const CloseBtn = ({ stylesObj, content }) => {
  return (
    <button
      className="btn"
      style={stylesObj}
      type="button"
      onClick={() => ReqResCtrl.closeReqRes(content.id)}
    >
        Close
    </button>
  )
};

export default CloseBtn;
