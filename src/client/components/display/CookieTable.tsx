import React from "react";
import { CookieTableRow } from "./CookieTableRow";

interface CookieProps {
  cookies: Array<Object>
}

const CookieTable = ({ cookies }: CookieProps) => {
  let cookieRowArray: Array<Object>;
  if (Array.isArray(cookies)) {
    cookieRowArray = cookies.map((cookie, i) => {
      return (
        <CookieTableRow className="cookieTableRow" cookie={cookie} key={i} />
      );
    });
  }
  return(
    <div className="cookieTable">
      <div className="cookieTableHeaders grid-9">
        <div className="cookieTableHeaderCell">Name</div>
        <div className="cookieTableHeaderCell">Value</div>
        <div className="cookieTableHeaderCell">Domain</div>
        <div className="cookieTableHeaderCell">HostOnly</div>
        <div className="cookieTableHeaderCell">Path</div>
        <div className="cookieTableHeaderCell">Secure</div>
        <div className="cookieTableHeaderCell">HttpOnly</div>
        <div className="cookieTableHeaderCell">Session</div>
        <div className="cookieTableHeaderCell">ExpirationDate</div>
      </div>
      {cookieRowArray}
    </div>
  )
}

export default CookieTable;
