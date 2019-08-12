import React, { Component } from 'react';
import ReqResCtrl from '../../controllers/reqResController';

class OpenBtn extends Component {
  constructor(props) {
    super(props);
    this.batchCall=this.batchCall.bind(this)
  }
  batchCall(id, time){
      let counter = 0
      if(time < 0 || !time){
        time = 0
      }
    if(this.props.content.isThisBatchCall){
      while(time >= counter ){
          ReqResCtrl.openReqRes(id)
          // console.log('hit',counter,'times')
          counter++
          this.props.content.batchlogCounter = counter
          this.props.reqResUpdate(this.props.content);
      }  
    }else{
      ReqResCtrl.openReqRes(id)
    }
  }
  render() {
    return (
      <button
        className="btn"
        style={this.props.stylesObj}
        type="button"
        // onClick={() => ReqResCtrl.openReqRes(this.props.content.id)}
        // onClick={()=>{this.batchCall(this.props.content.id, this.props.content.batchCount)}}
        onMouseDown={()=>{this.batchCall(this.props.content.id, this.props.content.batchCount)}}
      >
        Open
      </button>
    );
  }
}

export default OpenBtn;
