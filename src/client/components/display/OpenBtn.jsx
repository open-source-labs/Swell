import React, { Component } from 'react';
import ReqResCtrl from '../../controllers/reqResController';

class OpenBtn extends Component {
  constructor(props) {
    super(props);
    this.batchCall=this.batchCall.bind(this)
  }
  batchCall(id, time){
    // for(let i = 0; i<time ; i++){
      let counter = 0
    while(time >= counter ){
        ReqResCtrl.openReqRes(id)
        console.log('hit',counter,'times')
        counter++
    }  
    // }
  }
  render() {

    return (
      <button
        className="btn"
        style={this.props.stylesObj}
        type="button"
        // onClick={() => ReqResCtrl.openReqRes(this.props.content.id)}
        onClick={()=>{this.batchCall(this.props.content.id, 0)}}
      >
        Open
      </button>
    );
  }
}

export default OpenBtn;
