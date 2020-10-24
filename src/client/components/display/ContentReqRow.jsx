import React from 'react'

export default function ContentReqRow({ data }) {
  return (
  <div className="is-flex">
    <input className="input" type="text" value={data.key} className="is-justify-content-center p-1" readOnly />
    <input className="input" type="text" value={data.value} className="is-justify-content-center is-flex-grow-4 p-1" readOnly />
  </div>
  )
}
