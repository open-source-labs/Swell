import React from "react";
import { Button } from '@mui/material';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ImportExportWorkspaceModal from "../modals/import-export-workspace/ImportExportWorkspaceModal";
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


//creates the formatting for the little button that appears when you hover over the import/export icon
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


export default function ImportExportWorkspaceButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <div>
    <LightTooltip title="Import/Export">
        <Button
        variant="text"
        sx={{ maxWidth: '24px', maxHeight: '24px', minWidth: '24px', minHeight: '24px' }}
        onClick={handleOpen}>
        <ImportExportIcon fontSize="small"/>
        </Button>
    </LightTooltip> 
    <ImportExportWorkspaceModal open={open} handleClose={handleClose}/>     
    </div>
  )
}