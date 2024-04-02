import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';

import { collectionDeleted } from '../../../toolkit-refactor/slices/collectionsSlice';

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import collectionsController from '../../../controllers/collectionsController';
import { Button } from '@mui/material';
import { SwellTooltip } from '../../customMuiStyles/tooltip';
import { Collection, WorkspaceContainerProps } from '../../../../types';
import { RootState } from '../../../toolkit-refactor/store';

export default function DeleteRequestButton({
  currentWorkspaceId,
  setWorkspace,
}: WorkspaceContainerProps) {
  const dispatch = useAppDispatch();
  // Grab all of the workspaces from the Redux store. Hopefully this is O(1)...
  const allWorkspaces = useAppSelector((store: RootState) => store.collections);

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
