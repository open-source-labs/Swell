import React, { useState } from "react";

const getCookieVal = cookieKey =>
    document.cookie.split('; ').reduce((total, currentCookie) => {
       const splitCookie = currentCookie.split("=");
       const storedKey = splitCookie[0];
       const storedValue = splitCookie[1];
       return cookieKey === storedKey 
         ? decodeURIComponent(storedValue) 
         : total;
    }, '');

const createCookie = (key, value) => {
  // TODO: add a third argument to this finction that allows you to set a max age of the cookie (the expiry)
  // const now = new Date();
  // // set the expiry to now + time (n.b. the GitHub auth Token expires after 8 hours)
  // now.setTime(now.getTime() + (time));
  document.cookie = `${key}=${value}`;
};

/**
* Custom hook to retrieve and store cookies for our application.
* @param {String} key The key to store our data to
* @param {String} defaultCookieVal The default value to return in case the cookie doesn't exist
*/
const useCookie = (cookieKey, defaultCookieVal) => {
  const getCookie = () => getCookieVal(cookieKey) || defaultCookieVal;
  const [cookie, setCookie] = useState(getCookie());

  return [cookie];
};

export default useCookie;