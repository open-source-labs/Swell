import React from "react";

import RequestTreeItem from "./RequestTreeItem";
import RequestCard from "./RequestCard";

import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function CollectionTree({ currentWorkspace }) {

  const { reqResArray } = currentWorkspace;
  const requestTreeItems = []
  for (let content of reqResArray) {
    requestTreeItems.push(
      <RequestCard
        key={content.id}
        content={content}
      />
    )
  }
  // key={request.id} request={request}

  return (
    <TreeView
      aria-label="collection navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, overflowY: 'auto' }}
    >
      <TreeItem nodeId={currentWorkspace.id} label={currentWorkspace.name}>
        {requestTreeItems}
      </TreeItem>
    </TreeView>
  );
}
