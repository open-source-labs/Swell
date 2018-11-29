import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../ReqResCtrl';
import * as store from '../../store';
import * as actions from '../../actions/actions';

class ToggleAllBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClosed: true,
      prevContentBody: [],
      abortController: {},
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  componentDidMount(props) {
    this.setState({
      abortController: new AbortController(),
    });
  }

  handleToggleClick(e) {
    if (this.state.isClosed) {
      console.log('opening all');
      const abortCtrlArray = ReqResCtrl.abortControllsArray;
      console.log('abortCtrlArray>>>>>>', ReqResCtrl.abortControllsArray);
      // console.log('/////', e)
      const reqResContainer = document.querySelector('#reqResContainer');

      if (reqResContainer.hasChildNodes()) {
        // console.log('has children')
        // let children = reqResContainer.querySelectorAll('.resreq_component');
        const children = Array.prototype.slice.call(document.querySelectorAll('.resreq_component'));

        for (let i = 0; i < children.length; i++) {
          // console.log('looping...')
          // console.log('children...', children[i].querySelector("button").id);
          ReqResCtrl.toggleOpenEndPoint(children[i].querySelector('button').id, abortCtrlArray[i]);
        }
      }
      // for (let resReqObj of resReqArr) {
      //   fetchController(resReqArr[e.id].endPoint, resReqArr[e.id].method, resReqArr[e.id].serverType);
      // }

      this.setState({
        isClosed: !this.state.isClosed,
      });
    }
    else {
      console.log('close toggle all');
      ReqResCtrl.abortControllsArray.forEach((abortObject) => {
        abortObject.abort();
      });
    }
  }

  render() {
    return (
      <button onClick={this.handleToggleClick}>
        {this.state.isClosed ? 'OPEN ALL' : 'CLOSE ALL'}
      </button>
    );
  }
}

export default ToggleAllBtn;
