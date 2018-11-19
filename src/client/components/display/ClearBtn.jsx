import React from 'react';
import ReqResCtrl from '../ReqResCtrl';

const ClearBtn = () => {
  return (
    <button type='button'onClick={
      (e) => {
        ReqResCtrl.clearAllEndPoints(e)
      }
    }>ClearBtn</button>
  );
};

export default ClearBtn;