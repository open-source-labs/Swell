import React, { useState } from 'react';
// Import local components
import Http2Parameters from './Http2Parameters';
import Http2Headers from './Http2Headers'
// Import MUI components
import { Box, Tabs, Tab } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

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
      id={`http2-tabpanel-${index}`}
      aria-labelledby={`http2-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `http2-tab-${index}`,
    'aria-controls': `http2-tabpanel-${index}`,
  };
}

export default function Http2MetaData({ parameters, setParameters, headers, setHeaders }) {
  const [tab, setTab] = useState(0)
  const handleTabChange = (event: React.SyntheticEvent, tab: number) => {
    setTab(tab);
  };
  return(
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Parameters" {...a11yProps(0)} />
          <Tab label="Headers" {...a11yProps(1)} />
          <Tab label="Cookies" {...a11yProps(2)} />
          <Tab label="Body" {...a11yProps(3)} />
          <Tab label="Tests" {...a11yProps(4)} />
        </Tabs>
      </Box>
      {/* TODO: add parameter support for HTTP2 requests */}
      <TabPanel value={tab} index={0}>
        <Http2Parameters parameters={parameters} setParameters={setParameters}/>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Http2Headers />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Http2Headers />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        Render Body Input Here
      </TabPanel>
      <TabPanel value={tab} index={4}>
        Render Test Snippets Here
      </TabPanel>
    </Box>
  )
}
