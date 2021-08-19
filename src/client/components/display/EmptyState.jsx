import React from 'react';
import logofaded from '../../../assets/img/swell-logo-faded.png';

function EmptyState({ connection }) {
  return (
    <div className="empty-state-wrapper">
      <img className="empty-state-img" src={logofaded} alt="faded-logo" />
    </div>
  );
}

export default EmptyState;
