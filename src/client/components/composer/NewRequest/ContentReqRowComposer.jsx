/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

export default function ContentReqRowComposer({
  data,
  changeHandler,
  index,
  deleteItem,
  type,
}) {
  return (
    <div className={`is-flex mt-1 ${type}`} id={`${type}${index}`}>
      <div className="include-data-checkbox is-dark-mode ">
        <input
          type="checkbox"
          id={data.id}
          className="is-checkradio is-black has-no-border"
          checked={data.active}
          onChange={(e) => changeHandler(data.id, 'active', e.target.checked)}
        />
        <label htmlFor={data.id} />
      </div>
      <input
        onChange={(e) => changeHandler(data.id, 'key', e.target.value)}
        placeholder="Key"
        className="input "
        type="text"
        value={data.key}
        className="is-dark-mode is-justify-content-center p-1 key"
      />
      <input
        onChange={(e) => changeHandler(data.id, 'value', e.target.value)}
        placeholder="Value"
        className="input"
        type="text"
        value={data.value}
        className="is-dark-mode is-justify-content-center is-flex-grow-4 p-1 value"
      />
      <div className="is-flex is-justify-content-center is-align-items-center ml-1">
        <div className="delete m-auto" onClick={() => deleteItem(index)} />
      </div>
    </div>
  );
}
