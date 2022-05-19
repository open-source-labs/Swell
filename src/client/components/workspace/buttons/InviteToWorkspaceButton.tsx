import React from "react";
import { Button } from '@mui/material';
import { PersonAddAlt1Rounded } from '@mui/icons-material';
import InviteToWorkspaceModal from "../modals/invite-to-workspace/InviteToWorkspaceModal";
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

export default function ExportWorkspaceButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <div>
      <LightTooltip title="Invite to Workspace">
        <Button
          variant="text"
          sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
          onClick={handleOpen}>
          <PersonAddAlt1Rounded fontSize="small"/>
        </Button>
      </LightTooltip>
      <InviteToWorkspaceModal open={open} handleClose={handleClose}/>
    </div>
  )
}
