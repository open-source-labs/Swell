import * as React from "react";
import { CookieProps } from "../../../types";

const CookieTableCell = ({ detail }: CookieProps) => {
  return (
    <div className="cookieTableCell">{detail.toString()}</div>
  );
}

export default CookieTableCell;
