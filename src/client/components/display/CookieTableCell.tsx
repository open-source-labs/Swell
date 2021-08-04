/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import { CookieProps } from '../../../types';

const CookieTableCell = ({ detail }: CookieProps) => (
  <div className="cookieTableCell">{detail.toString()}</div>
);

export default CookieTableCell;
