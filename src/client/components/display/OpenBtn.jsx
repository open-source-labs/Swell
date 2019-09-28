import React, { Component } from 'react';
import ReqResCtrl from '../../controllers/reqResController';

class OpenBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.content.id);
    return (
      <button
        className="btn"
        style={this.props.stylesObj}
        type="button"
        onClick={() => ReqResCtrl.openReqRes(this.props.content.id)}
      >
        Open
      </button>
    );
  }
}

export default OpenBtn;
