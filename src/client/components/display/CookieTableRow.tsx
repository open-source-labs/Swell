import * as React from "react";
import CookieTableCell from "./CookieTableCell";
import { any } from "prop-types";
import { CookieProps } from "../../../types";

const CookieTableRow = ({ cookies }: CookieProps) => {

  let tableCellArray: any[] = [];
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
