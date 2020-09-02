import * as React from "react";
import CookieTableCell from "./CookieTableCell";

const CookieTableRow = ({ cookies }) => {

  const tableCellArray = [];
  for (const key in cookies) {
    tableCellArray.push(
      <CookieTableCell detail={cookies[key]} key={key} />
    );
  }
  if (!cookies.expirationDate) {
    tableCellArray.push(<CookieTableCell detail="" key="expirationDate" />);
  }
  return (
    <div className="cookieTableRow grid-9">{tableCellArray}</div>
  )
}

export default CookieTableRow;
