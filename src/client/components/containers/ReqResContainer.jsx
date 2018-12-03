import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../actions/actions";
import ReqRes from "../display/ReqRes.jsx";

const mapStateToProps = store => ({
  reqRes: store.business.reqResArray,
  currentTab: store.business.currentTab,
  resReqLength: store.business.reqResArray
});

const mapDispatchToProps = dispatch => ({});

class ReqResContainer extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const reqResArr = this.props.reqRes
      .filter(reqRes => reqRes.tab === this.props.currentTab)
      .map((reqRes, index) => {
        return <ReqRes className="reqResChild" content={reqRes} key={index} />;
      });

    let dynamicCols;
    let num;
    const requestInstances = this.props.reqRes.length;

    console.log('~~~~~~~~requestInstances~~~~~~~~', requestInstances)
    switch (requestInstances) {
      case 1:
        console.log('+++++++++ 1');
        dynamicCols = { 
          width: 'calc(100vw - 356px)',
          display: 'grid', 
          gridTemplateColumns: 'repeat(1, 100%)' };
        num = 'one';
        break;
      case 2:
        console.log('+++++++++ 2');
        dynamicCols = {
          width: 'calc((100vw - 356px)*2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 50%)',
        };
        num = 'two';
        break;
      case 3:
        console.log('+++++++++ 3');
        dynamicCols = {
          width: 'calc((100vw - 356px)*3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 33.333%)',
        };
        num = 'three';
        break;
      case 4:
        console.log('+++++++++ 4');
        dynamicCols = {
          width: 'calc((100vw - 356px)*4)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 25%)',
        };
        num = 'four';
        break;
      case 5:
        console.log('+++++++++ 5');
        dynamicCols = {
          width: 'calc((100vw - 356px)*5)',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 20%)',
        };
        num = 'five';
        break;
      case 6:
        console.log('+++++++++ 6');
        dynamicCols = {
          width: 'calc((100vw - 356px)*6)',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 16.666%)',
        };
        num = 'six';
        break;
      default:
      // console.log(`There was an error`);
    }

    return (
      <div id="reqResContainer">
        <div id='reqResContainer_inner' style={dynamicCols}>
          {reqResArr}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReqResContainer);
