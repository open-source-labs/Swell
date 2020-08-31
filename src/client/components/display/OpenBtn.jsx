import React from "react";
import ReqResCtrl from "../../controllers/reqResController";

const OpenBtn = ({ stylesObj, content }) => {
  return (
    <button
      className="btn"
      style={stylesObj}
      type="button"
      //Button opens connection to network through reqResController function, passing in only the ReqRes ID
      onClick={() => ReqResCtrl.openReqRes(content.id)}
    >
      Send
    </button>
  );
}

export default OpenBtn;
