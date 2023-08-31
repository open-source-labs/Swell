import React, { useState } from 'react';

// Import local components
import WorkspaceContainer from './WorkspaceContainer';
import HistoryContainer from './HistoryContainer';
// Import MUI components and icons
import { Box, Tabs, Tab, Button } from '@mui/material';
import { AccessTime, Work } from '@mui/icons-material';
import { $NotUsed, WorkspaceContainerProps } from '../../../types';

/**
 * Not sure if this is overkill, but the previous implementation had support for
 * passing in extra props for the div. Went ahead and typed it super-precisely
 */
type TabPanelProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  children?: React.ReactNode;
  index: number;
  activeIndex: number;
};

function TabPanel({
  children,
  activeIndex,
  index,
  ...delegatedProps
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={activeIndex !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...delegatedProps}
    >
      {activeIndex === index && (
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
  } as const;
}

export default function HistoryOrWorkspaceContainer(
  props: WorkspaceContainerProps
) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // According to MUI, the second argument will default to type number when
  // possible; skeeves me out that they don't support type parameters for this,
  // and you have to cast newValue from "any" to "number" yourself
  const onMuiTabIndexChange = (_: $NotUsed, newValue: number) => {
    setActiveTabIndex(newValue);
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
          value={activeTabIndex}
          onChange={onMuiTabIndexChange}
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

      <TabPanel activeIndex={activeTabIndex} index={0}>
        <WorkspaceContainer {...props} />
      </TabPanel>

      <TabPanel activeIndex={activeTabIndex} index={1}>
        <HistoryContainer />
      </TabPanel>
    </Box>
  );
}
