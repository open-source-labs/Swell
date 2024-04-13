import React from 'react';
import logofaded from '../../../../assets/img/swell-logo-faded.avif';
import { useAppSelector } from '../../../toolkit-refactor/hooks';

interface EmptyStateProps {
  connection?: any;
}

export default function EmptyState({ connection }: EmptyStateProps) {
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

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
