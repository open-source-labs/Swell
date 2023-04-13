import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import React from 'react';

const FONTSIZE: number = 13;

export const SwellTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
    fontSize: FONTSIZE,
  },
});

export const SwellWrappedTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: FONTSIZE,
    textAlign: 'center',
  },
});

