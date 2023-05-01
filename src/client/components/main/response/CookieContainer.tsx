/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface CookieProps {
  className?: string;
  cookie: {
    [key: string]: any;
  };
}

export default function CookieContainer({ className, cookie }: CookieProps) {
  const [showCookie, setShowCookie] = useState(false);
  const isDark = useSelector((state: any) => state.ui.isDark);

  const cookies = Object.entries(cookie).map(([key, value], index) => {
    if (!key || !value) return null;
    if (showCookie === true && index > 1) {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td className="table-value">{value.toString()}</td>
        </tr>
      );
    }
    if (index <= 1) {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td className="table-value">{value.toString()}</td>
        </tr>
      );
    }
    return null;
  });

  return (
    <table
      className={`cookie-container table ${isDark ? 'is-dark-200' : ''} ${className}`}
      onClick={() => {
        setShowCookie(showCookie === false);
      }}
    >
      <thead>
        <tr className="is-size-7">
          <th style={{ width: '96px' }}>Key</th>
          <th className="table-value">Value</th>
        </tr>
      </thead>
      <tbody className="is-size-7">{cookies}</tbody>
    </table>
  );
}

