import React from 'react';
import ReqResCtrl from '../ReqResCtrl';

const OpenAllBtn = () => {
  return (
    <button type='button' onClick={
      (e) => { 
        ReqResCtrl.openAllEndPoints(e)
      }
    }>OpenAllBtn</button>
  );
};

export default OpenAllBtn;