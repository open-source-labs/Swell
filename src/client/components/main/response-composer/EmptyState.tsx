import React from 'react';
import logofaded from '../../../../assets/img/swell-logo-faded.avif';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../client/toolkit-refactor/store';

interface EmptyStateProps {
  connection?: any;
}


export default function EmptyState({ connection }: EmptyStateProps) {
  const isDark = useSelector((store: RootState) => store.ui.isDark);

  return (
    <div className="empty-state-wrapper">
      <img
        className="empty-state-img"
        src={logofaded}
        alt="faded-logo"
        style={{ filter: isDark ? 'invert(1)' : 'none' }}
      />
    </div>
  );
}
