import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../rtk/store';
import { collectionDeleted } from '../../../rtk/slices/collectionsSlice';

import { type Collection, type WorkspaceContainerProps } from '~/types';
import collectionsController from '~/controllers/collectionsController';

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Button } from '@mui/material';
import { SwellTooltip } from '~/components/customMuiStyles/tooltip';

export default function DeleteRequestButton({
  currentWorkspaceId,
  setWorkspace,
}: WorkspaceContainerProps) {
  const allWorkspaces = useAppSelector((store) => store.collections);
  const dispatch = useAppDispatch();

  const currentWorkspace = (): Collection => {
    const workspace: Collection | undefined = allWorkspaces.find(
      (workspace: Collection) => {
        return workspace.id === currentWorkspaceId;
      }
    );
    return workspace || ({} as Collection);
  };

  const deleteWorkspace = () => {
    dispatch(collectionDeleted(currentWorkspace()));
    collectionsController.deleteCollectionFromIndexedDb(currentWorkspaceId);
    setWorkspace('');
  };

  return (
    <SwellTooltip title="Delete Workspace">
      <Button
        color="error"
        variant="text"
        sx={{
          maxWidth: '24px',
          maxHeight: '24px',
          minWidth: '24px',
          minHeight: '24px',
        }}
        onClick={deleteWorkspace}
      >
        <ClearRoundedIcon fontSize="small" />
      </Button>
    </SwellTooltip>
  );
}
