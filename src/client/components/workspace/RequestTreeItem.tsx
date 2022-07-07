import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RequestCard from './RequestCard';
import TreeItem from '@mui/lab/TreeItem';
import { RootState } from '../../toolkit-refactor/store';

export default function RequestTreeItem({ request }) {
  /**
   * @todo Implement "Show Details" functionality here. It seems that the
   * "Show Details" functionality is only for WebRTC.
   */
  const dispatch = useDispatch();

  const currentResponse = useSelector(
    (store: RootState) => store.reqRes.reqResArray
  );

  const newRequestFields = useSelector(
    (store: RootState) => store.newRequestFields
  );

  return <TreeItem nodeId={request.id} label={<RequestCard />} />;
}
