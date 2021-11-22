import React from 'react';
import { useSelector } from 'react-redux';

import EmptyState from '../display/EmptyState';

function HeadersContainer({ currentResponse }) {

  const isDark = useSelector(state => state.ui.isDark);

  if (
    !currentResponse.response ||
    !currentResponse.response.headers ||
    Object.entries(currentResponse.response.headers).length === 0
  ) {
    return <EmptyState />;
  }

  const responseHeaders = Object.entries(currentResponse.response.headers).map(
    ([key, value], index) => {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td className="table-value">{value}</td>
        </tr>
      );
    }
  );

  return (
    <div>
      <div>
        <div className="table-container mx-3 extended">
          <table className={`${isDark ? 'is-dark-200' : ''} table mx-3`}>
            <thead className="is-size-7">
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody className="is-size-7">{responseHeaders}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HeadersContainer;
