import * as React from "react";
import { CookieTableCell } from "./CookieTableCell";
import { any } from "prop-types";

export class CookieTableRow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    let tableCellArray: any[] = [];
    for (const key in this.props.cookie) {
      tableCellArray.push(
        <CookieTableCell detail={this.props.cookie[key]} key={key} />
      );
    }
    if (!this.props.cookie.expirationDate) {
      tableCellArray.push(<CookieTableCell detail="" key="expirationDate" />);
    }
    return <div className="cookieTableRow grid-9">{tableCellArray}</div>;
  }
}

//export default CookieTableRow;
