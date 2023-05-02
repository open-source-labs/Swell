import React from 'react';
import EmptyState from './EmptyState';
import SingleTestContainer from './SingleTestContainer';
import { ReqRes, TestResult } from '../../../../types';

interface Props {
  currentResponse: ReqRes;
}

const TestsContainer: React.FC<Props> = ({ currentResponse }) => {
  return currentResponse.response?.testResult?.length ? (
    <SingleTestContainer currentResponse={currentResponse} />
  ) : (
    <EmptyState />
  );
};

export default TestsContainer;
