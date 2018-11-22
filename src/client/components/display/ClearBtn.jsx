import React from 'react';
import ReqResCtrl from '../../controllers/connectionController';

const ClearBtn = () => {
  return (
    <button className={'btn'} type='button'onClick={ ReqResCtrl.clearAllReqRes }>ClearBtn</button>
  );
};

export default ClearBtn;