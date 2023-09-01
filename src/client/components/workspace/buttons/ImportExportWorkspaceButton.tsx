import React from 'react';

import { Button } from '@mui/material';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ImportExportWorkspaceModal from '../modals/import-export-workspace/ImportExportWorkspaceModal';
import { SwellTooltip } from '~/components/customMuiStyles/tooltip';

export default function ImportExportWorkspaceButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <SwellTooltip title="Import/Export">
        <Button
          variant="text"
          sx={{
            maxWidth: '24px',
            maxHeight: '24px',
            minWidth: '24px',
            minHeight: '24px',
          }}
          onClick={handleOpen}
        >
          <ImportExportIcon fontSize="small" />
        </Button>
      </SwellTooltip>
      <ImportExportWorkspaceModal open={open} handleClose={handleClose} />
    </div>
  );
}

