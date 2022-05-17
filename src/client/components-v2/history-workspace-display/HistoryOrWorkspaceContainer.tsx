import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WorkspaceContainer from "../workspace/WorkspaceContainer";
import HistoryContainer from '../../components/containers/HistoryContainer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';

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
        <Box sx={{ p: 3 }}>
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

export default function HistoryOrWorkspaceContainer() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: '25%', overflow: 'auto', maxHeight: '100%', overflowX: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab icon={<WorkIcon />} label="Current Workspace"  {...a11yProps(0)} sx={{fontSize:'10px', overflowWrap: "break-word", maxWidth: '50%'}}/>
          <Tab icon={<AccessTimeIcon />} label='View History' {...a11yProps(1)} sx={{fontSize:'10px', overflowWrap: "break-word", maxWidth: '50%'}}/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <WorkspaceContainer />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoryContainer />
      </TabPanel>
    </Box>
  );
}