import React from "react";
import SingleTestContainer from './SingleTestContainer';

export default function TestsContainer({ currentResponse }) {

  return (
    <>
      {
        currentResponse.response !== undefined &&
        <SingleTestContainer currentResponse={currentResponse} />
      }
    </>
  )
}