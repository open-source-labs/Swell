/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../toolkit-refactor/hooks';

export default function TestSnippetsButton({
  showSnippets,
  handleShowSnippets,
}: {
  showSnippets: boolean;
  handleShowSnippets: () => void;
}) {
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);
  return (
    <div
      className={`${
        isDark ? 'is-dark-200' : ''
      } is-rest-invert show-hide-tests cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center`}
      onClick={handleShowSnippets}
    >
      {showSnippets === true && (
        <>
          <span>Hide Sample Assertion Test Snippets</span>
        </>
      )}

      {showSnippets === false && (
        <>
          <span>View Sample Assertion Test Snippets</span>
        </>
      )}
    </div>
  );
}

