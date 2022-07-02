import React from 'react';
import { useDispatch } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

/**@todo delete when slice conversion complete */
import * as actions from '../../features/business/businessSlice';

import { reqResReplaced } from '../../toolkit-refactor/reqRes/reqResSlice';

export default function WorkspaceContextMenu({ id, name, reqResArray }) {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const dispatch = useDispatch();
  const collectionsToReqRes = (reqResArray) => {
    dispatch(reqResReplaced(reqResArray));
  };

  // <MenuItem
  //   key={workspace.id}
  //   value={workspace.id}
  //   onClick={() => collectionsToReqRes(workspace.reqResArray)}
  // >
  //   {workspace.name}
  // </MenuItem>

  return (
    <MenuItem
      key={id}
      value={id}
      onClick={() => collectionsToReqRes(reqResArray)}
    >
      <div
        onContextMenu={handleContextMenu}
        style={{ cursor: 'context-menu', width: '100%' }}
      >
        <Typography>{name}</Typography>
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </Menu>
      </div>
    </MenuItem>
  );
}
