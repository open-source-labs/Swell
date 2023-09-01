import React from 'react';
import logofaded from '~/assets/img/swell-logo-faded.png';

interface EmptyStateProps {
  connection?: any;
}

export default function EmptyState({ connection }: EmptyStateProps) {
  return (
    <div className="empty-state-wrapper">
      <img className="empty-state-img" src={logofaded} alt="faded-logo" />
    </div>
  );
}
