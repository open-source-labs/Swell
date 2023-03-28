import React from 'react';
// Import MUI components
import { Box } from '@mui/material';
// Import local components.
import ProtocolSelect from './ProtocolSelect';
import GeneralInfo from './GeneralInfo';

export default function NavBarContainer() {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row', bgcolor: '#4f5a74' }}
      width="100%"
    >
      {/* Protocol select buttons. */}
      <ProtocolSelect />
      {/* General information about Swell. */}
      <GeneralInfo />
    </Box>
  );
}
