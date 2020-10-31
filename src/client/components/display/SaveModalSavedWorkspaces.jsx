import React from 'react'

export default function SaveModalSavedWorkspaces({ name, inputID, updateCollection }) {
  return (
    <div>
      <div className="is-flex is-justify-content-space-between m-3">
        <div 
          className="is-clickable is-primary-link is-align-items-center is-flex"
          onClick={() => {updateCollection(name, inputID); }}
        >
          {name}
        </div>
      </div>
    </div>
  )
}