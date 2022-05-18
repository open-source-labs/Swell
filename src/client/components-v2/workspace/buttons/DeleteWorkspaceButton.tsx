import React from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../../features/business/businessSlice'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import collectionsController from '../../../controllers/collectionsController';
import { Button } from '@mui/material';

export default function DeleteRequestButton(props) {
  const dispatch = useDispatch();

  const deleteWorkspace = () => {
    dispatch(actions.deleteFromCollection(props.currentWorkspace));
    collectionsController.deleteCollectionFromIndexedDb(props.id)
  };

  return(
    <Button
      color="error"
      variant="text"
      sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
      onClick={deleteWorkspace}
    >
      <DeleteForeverRoundedIcon fontSize="small"/>
    </Button>
  )
}
