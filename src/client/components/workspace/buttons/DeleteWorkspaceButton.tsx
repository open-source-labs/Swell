import React from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../../features/business/businessSlice'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import collectionsController from '../../../controllers/collectionsController';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      fontWeight: 'bold',
    },
}));

export default function DeleteRequestButton(props) {
  const dispatch = useDispatch();

  const deleteWorkspace = () => {
    dispatch(actions.deleteFromCollection(props.currentWorkspace));
    collectionsController.deleteCollectionFromIndexedDb(props.id)
  };

  return(
    <LightTooltip title="Delete Workspace">
      <Button
        color="error"
        variant="text"
        sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
        onClick={deleteWorkspace}
      >
        <ClearRoundedIcon fontSize="small"/>
      </Button>
    </LightTooltip>
  )
}
