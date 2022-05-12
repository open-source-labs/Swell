import React from 'react';

function StatusButtons({ currentResponse }) {
  if (currentResponse.error || !currentResponse) {
    return <div className="status-tag is-danger">Error</div>;
  }

  // STATUS FOR GRAPHQL
  if (currentResponse.graphQL === true && currentResponse.response) {
    return <div className="status-tag is-success">Success</div>;
  }

  if (
    !currentResponse.response ||
    !currentResponse.response.headers ||
    Object.keys(currentResponse.response.headers).length === 0 ||
    !currentResponse.response.headers[':status']
  ) {
    return null;
  }

  // RECEIVING STATUS CODE AND CONVERTING INTO STRING
  const statusCode = currentResponse.response.headers[':status'].toString();

  if (statusCode.startsWith('2')) {
    return <div className="status-tag is-success">{statusCode}</div>;
  }

  return <div className="status-tag is-danger">{statusCode}</div>;
}

export default StatusButtons;
