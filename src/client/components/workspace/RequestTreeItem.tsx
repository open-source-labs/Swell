import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RequestCard from './RequestCard';
import TreeItem from '@mui/lab/TreeItem';
import { RootState } from '../../toolkit-refactor/store';

export default function RequestTreeItem({ request }) {
  /**
   * TODO: implement "Show Details" functionality here
   * To add here, it seems that the "Show Details" functionality is only for WebRTC
   */
  const dispatch = useDispatch();

  /**
   * TODO: refactor store to remove explicit any. Will require refactoring the reqRes array type.
   */
  const currentResponse = useSelector(
    (store: RootState) => store.reqRes.reqResArray
  );

  const newRequestFields = useSelector(
    (store: RootState) => store.newRequestFields
  );

  return <TreeItem nodeId={request.id} label={<RequestCard />} />;
}
