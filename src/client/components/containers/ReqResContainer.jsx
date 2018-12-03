import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../actions/actions";
import ReqRes from "../display/ReqRes.jsx";
import SweetScroll from 'sweet-scroll';

const mapStateToProps = store => ({
  reqRes: store.business.reqResArray,
  currentTab: store.business.currentTab
});

const mapDispatchToProps = dispatch => ({});

class ReqResContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let reqResArr = this.props.reqRes
      .filter(reqRes => reqRes.tab === this.props.currentTab)
      .map((reqRes, index) => {
        return <ReqRes className="reqResChild" content={reqRes} key={index} />;
      });

    let dynamicCols;
    let num;
    // console.log('>', this.props.reqRes.length);

    let requestInstances = this.props.reqRes.length;

    switch (requestInstances) {
      case 1:
        dynamicCols = { display: "grid", gridTemplateColumns: "1, 100%" };
        num = 'one';
        break;
      case 2:
        dynamicCols = {
          display: "grid",
          gridTemplateColumns: "repeat(2, 50%)"
        };
        num = 'two';
        break;
      case 3:
        dynamicCols = {
          display: "grid",
          gridTemplateColumns: "repeat(3, 33.333%)"
        };
        num = 'three';
        break;
      case 4:
        dynamicCols = {
          display: "grid",
          gridTemplateColumns: "repeat(4, 25%)"
        };
        num = 'four';
        break;
      case 5:
        dynamicCols = {
          display: "grid",
          gridTemplateColumns: "repeat(5, 20%)"
        };
        num = 'five';
        break;
      case 6:
        dynamicCols = {
          display: "grid",
          gridTemplateColumns: "repeat(6, 16.666%)"
        };
        num = 'six';
        break;
      default:
      // console.log(`There was an error`);
    }

    const itmOne = document.querySelector('#itmOne');
    const itmTwo = document.querySelector('#itmTwo');
    const itmThree = document.querySelector('#itmThree');
    const itmFour = document.querySelector('#itmFour');
    const itmFive = document.querySelector('#itmFive');
    const itmSix = document.querySelector('#itmSix');
    var sweetScroll = new SweetScroll({
      horizontal: true,
    }, ".reqResContainer_inner");

    let offset;


    return (
      <div id="reqResContainer">
        <div id='reqResContainer_inner' style={dynamicCols} >
          {reqResArr}
        </div>
        <div id="jumpLinks">
          <button onClick={(e) => { 
          console.log('>>>>>>', this.props.reqRes[0].id);
            document.querySelector('#reqResContainer_inner').classList.add('offset-one-six');
            }}>1</button>
          <button onClick={(e) => { 
          console.log('>>>>>>', this.props.reqRes[1].id);
            document.querySelector('#reqResContainer_inner').classList.add('offset-two-six');
            }}>2</button>



          <button onClick={(e) => { 
          console.log('>>>>>>', this.props.reqRes[2].id);
            let el = document.querySelectorAll('.resreq_wrap')[2];
            offset = el.offsetLeft;
            console.log('>>>>>>>', el);
            console.log('>>>>>>>>>>>',el.offsetLeft);
            document.querySelector('#reqResContainer_inner').setAttribute('style', `${dynamicCols}; transform: translateX(-${el.offsetLeft}px)`);
            //.classList.add('offset-three-six');
            }}>3</button>




          <button onClick={(e) => { 
          console.log('>>>>>>', this.props.reqRes[3].id);
            document.querySelector('#reqResContainer_inner').classList.add('offset-four-six');
            }}>4</button>
          <button onClick={(e) => { 
          console.log('>>>>>>', this.props.reqRes[4].id);
            document.querySelector('#reqResContainer_inner').classList.add('offset-five-six');
            }}>5</button>
          <button onClick={(e) => { 
          console.log('>>>>>>', this.props.reqRes[5].id);
            document.querySelector('#reqResContainer_inner').classList.add('offset-six-six');
            }}>6</button>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReqResContainer);
