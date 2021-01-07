import React from "react";
import EmptyState from "../display/EmptyState";
import SingleTestContainer from './SingleTestContainer';

export default function TestsContainer({ currentResponse }) {
  return (
    currentResponse.response && 
    currentResponse.response.testResult && 
    currentResponse.response.testResult.length > 0 ? 
    <SingleTestContainer currentResponse={currentResponse} /> 
    : <EmptyState />
  );
}
