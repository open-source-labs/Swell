import React from 'react'

export default function SingleTestContainer({ currentResponse }) {

  const {
    request,
    response
  } = currentResponse;

  const url = currentResponse.url;

  return (
  <>
    <div className="is-flex cards-titlebar mt-2 mx-2">
      <div className='is-flex-grow-1 is-rest is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium'>
        Tests
      </div>
      <div className="is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center is-justify-content-space-between">
        <div className="is-flex is-align-items-center ml-2">{url}</div>
      </div>
    </div>
    <div className="is-neutral-200-box p-3 mx-2">
      <div>
        PASS
      </div>
      <div>
        graph.js logic here
      </div>
    </div>
  </>
  )
}
