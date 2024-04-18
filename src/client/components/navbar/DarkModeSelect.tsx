import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icon for light mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icon for dark mode
import { useAppDispatch, useAppSelector } from '../../toolkit-refactor/hooks';
import { toggleDarkMode } from '../../toolkit-refactor/slices/uiSlice';

export default function DarkModeToggle() {
 const dispatch = useAppDispatch();
 const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

 const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode(!isDark));
 };

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
      <IconButton
        onClick={handleToggleDarkMode}
        data-testid="dark-mode-toggle-button"
      >
        {/* Conditionally render the icon based on the isDark state */}
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
 );
}
