import React, { Component } from 'react';
import ReqResCtrl from '../../controllers/reqResController';

class OpenBtn extends Component {
  constructor(props) {
    super(props);
    this.batchCall=this.batchCall.bind(this)
  }
  batchCall(id, time){
    let counter = 0
    //prevents user from entering falsey or negative values
    if(time < 0 || !time){
      time = 0
    }
    //if this current request has batch call ticked...
    if(this.props.content.isThisBatchCall){
      //check if the amount of times the user wants to batch call is greater than zero 
      while(time > counter ){
          //if it is, make a request
            ReqResCtrl.openReqRes(id)
            // console.log('hit',counter,'times')
            //and increment counter 
            counter++
            this.props.content.batchlogCounter = counter
            //update state with our counter to track our iteration
            this.props.reqResUpdate(this.props.content);
            //Repeat until counter is greater than times
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
