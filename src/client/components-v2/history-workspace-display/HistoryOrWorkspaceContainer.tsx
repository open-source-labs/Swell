import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import BarGraph from '../../components/display/BarGraph';
import ScheduleContainer from '../../components/containers/ScheduleContainer';
import WorkspaceContainer from "../workspace/WorkspaceContainer";
import HistoryContainer from '../../components/containers/HistoryContainer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import ScheduleSendRoundedIcon from '@mui/icons-material/ScheduleSendRounded';

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

  const currentResponse = useSelector((store: any) => store.business.currentResponse);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: '25%', overflow: 'auto', maxHeight: '100%', overflowX: 'auto', overflowY: 'scroll' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab icon={<WorkIcon fontSize='small'/>} {...a11yProps(0)} sx={{fontSize:'10px', overflowWrap: "break-word", maxWidth: '50%'}}/>
          <Tab icon={<ScheduleSendRoundedIcon fontSize='small'/>} {...a11yProps(1)} sx={{fontSize:'10px', overflowWrap: "break-word", maxWidth: '50%'}}/>
          <Tab icon={<AccessTimeIcon fontSize='small'/>} {...a11yProps(2)} sx={{fontSize:'10px', overflowWrap: "break-word", maxWidth: '50%'}}/>
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
