import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TreeItem from '@mui/lab/TreeItem';

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
    (store: any) => store.business.currentResponse
  );

  const newRequestFields = useSelector(
    (store: any) => store.business.newRequestFields
  );

  return(
    <TreeItem nodeId={request.id} label={<div>hello</div>} />
  )
}
