import * as React from 'react';
import { useSelector } from 'react-redux';
// Import local components
import BarGraph from '../legacy-components/BarGraph';
import ScheduleContainer from '../legacy-components/ScheduleContainer';
import WorkspaceContainer from "./WorkspaceContainer";
import HistoryContainer from './HistoryContainer';
// Import MUI components and icons
import { Box ,Tabs, Tab, Button } from '@mui/material'
import { AccessTime, Work, ScheduleSendRounded } from '@mui/icons-material'

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

export default function HistoryOrWorkspaceContainer(props) {
  const [showGraph, setShowGraph] = React.useState(false);
  const [value, setValue] = React.useState(0);

  // const currentResponse = useSelector((store: any) => store.business.currentResponse);

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
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab icon={<Work fontSize='small'/>} {...a11yProps(0)} sx={{fontSize:'10px', overflowWrap: "break-word", width: '33.33%'}}/>
          <Tab icon={<ScheduleSendRounded fontSize='small'/>} {...a11yProps(1)} sx={{fontSize:'10px', overflowWrap: "break-word", width: '33.33%'}}/>
          <Tab icon={<AccessTime fontSize='small'/>} {...a11yProps(2)} sx={{fontSize:'10px', overflowWrap: "break-word", width: '33.33%'}}/>
        </Tabs>
      </Box>
      {value === 1 && (<Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: 1,
          py: 1
        }}
      >
        <Button
          className={`is-flex is-align-items-center is-justify-content-center is-graph-footer is-clickable`}
          variant='outlined'
          onClick={() => setShowGraph(showGraph === false)}
        >
          {showGraph && 'Hide Response Metrics'}
          {!showGraph && 'View Response Metrics'}
        </Button>
        {( showGraph && <Box sx={{
          py: 1
        }}>
          <BarGraph />
        </Box>
        )}
        </Box>
      )}
      <TabPanel value={value} index={0}>
        <WorkspaceContainer {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ScheduleContainer />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HistoryContainer />
      </TabPanel>
    </Box>
  );
}
