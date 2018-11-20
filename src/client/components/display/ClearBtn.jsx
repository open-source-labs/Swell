import React from 'react';
import ReqResCtrl from '../../controllers/connectionController';

const ClearBtn = () => {
  return (
    <button type='button'onClick={ ReqResCtrl.clearAllReqRes }>ClearBtn</button>
  );
};

export default ClearBtn;