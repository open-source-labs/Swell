import * as React from "react";

export class CookieTableCell extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="cookieTableCell">{this.props.detail.toString()}</div>
    );
  }
}

//export default CookieTableCell;
