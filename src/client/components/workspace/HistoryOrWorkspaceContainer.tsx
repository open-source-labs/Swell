import * as React from 'react';
import { useSelector } from 'react-redux';
// Import local components
import WorkspaceContainer from './WorkspaceContainer';
import HistoryContainer from './HistoryContainer';
// Import MUI components and icons
import { Box, Tabs, Tab, Button } from '@mui/material';
import { AccessTime, Work } from '@mui/icons-material';
import { WorkspaceContainerProps } from '../../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function HistoryOrWorkspaceContainer(
  props: WorkspaceContainerProps
) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: '25%',
        height: '100%',
        overflowY: 'scroll',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            icon={<Work fontSize="small" />}
            {...a11yProps(0)}
            sx={{
              fontSize: '10px',
              overflowWrap: 'break-word',
              width: '50%',
            }}
          />
          <Tab
            icon={<AccessTime fontSize="small" />}
            {...a11yProps(1)}
            sx={{
              fontSize: '10px',
              overflowWrap: 'break-word',
              width: '50%',
            }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <WorkspaceContainer {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoryContainer />
      </TabPanel>
    </Box>
  );
}
