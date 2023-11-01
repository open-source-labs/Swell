import React from 'react';
import Box from '@mui/material/Box';
import GitHubButton from 'react-github-btn';

export default function GeneralInfo() {
  return (
    <Box
      key="swell-info"
      sx={{
        flexGrow: 0,
        display: 'flex',
        alignItems: 'center',
        alignContent: 'right',
        pr: 1.5,
      }}
    >
      {/**
       * @todo This GitHub button comes from a component library. Should build
       * your own or find one that supports TS types.
       */}

      {/* @ts-ignore:next-line */}
      <GitHubButton
        href="https://github.com/open-source-labs/Swell"
        data-size="large"
        data-show-count="true"
        aria-label="Star open-source-labs/Swell on GitHub"
      >
      </GitHubButton>

    </Box>
  );
}
