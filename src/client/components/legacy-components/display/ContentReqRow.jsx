import React from 'react';

function ContentReqRow({ data }) {
  return (
    <div className="is-flex">
      <input
        type="text"
        value={data.key}
        className="is-justify-content-center p-1"
        readOnly
      />
      <input
        type="text"
        value={data.value}
        className="is-justify-content-center is-flex-grow-4 p-1"
        readOnly
      />
    </div>
  );
}

export default ContentReqRow;
