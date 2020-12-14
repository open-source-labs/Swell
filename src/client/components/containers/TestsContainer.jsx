import React from "react";
import EmptyState from "../display/EmptyState";
import SingleTestContainer from './SingleTestContainer';

export default function TestsContainer({ currentResponse }) {

  return currentResponse.response ? 
  <SingleTestContainer currentResponse={currentResponse} /> : <EmptyState />;
}
