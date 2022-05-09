import React from "react";

import RequestTreeItem from "./RequestTreeItem";

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import WorkspaceContainer from "./WorkspaceContainer";

export default function CollectionTree({ currentWorkspace }) {

  const { reqResArray } = currentWorkspace;
  const requestTreeItems = []
  for (let request of reqResArray) {
    requestTreeItems.push(<RequestTreeItem key={request.id} request={request}/>)
  }

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