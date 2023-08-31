import React, { useState } from 'react';
import { useAppDispatch } from '~/toolkit/store';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { reqResReplaced } from '../../toolkit-refactor/slices/reqResSlice';

type MousePosition = {
  mouseX: number;
  mouseY: number;
};

export default function WorkspaceContextMenu({ id, name, reqResArray }) {
  const [menuPosition, setMenuPosition] = useState<MousePosition | null>(null);
  const dispatch = useAppDispatch();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition(
      menuPosition === null
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
    setMenuPosition(null);
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
      onClick={() => dispatch(reqResReplaced(reqResArray))}
    >
      <div
        onContextMenu={handleContextMenu}
        style={{ cursor: 'context-menu', width: '100%' }}
      >
        <Typography>{name}</Typography>
        <Menu
          open={menuPosition !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            menuPosition !== null
              ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </Menu>
      </div>
    </MenuItem>
  );
}
