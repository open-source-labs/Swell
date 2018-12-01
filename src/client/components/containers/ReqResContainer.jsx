import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import ReqRes from '../display/ReqRes.jsx';

const mapStateToProps = store => ({
  reqRes: store.business.reqResArray,
  currentTab: store.business.currentTab,
});

const mapDispatchToProps = dispatch => ({});

class ReqResContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let reqResArr = this.props.reqRes.filter(reqRes => reqRes.tab === this.props.currentTab).map((reqRes,index) => {
      return <ReqRes className="reqResChild" content={reqRes} key={index}></ReqRes>
    });

    let dynamicCols;
    console.log('>', this.props.reqRes.length);
    
    let requestInstances = this.props.reqRes.length;

    switch (requestInstances) {
      case 1:
          dynamicCols = {'display' : 'grid', 'gridTemplateColumns' : '1, 100%'}
          break;
      case 2:
          dynamicCols = {'display' : 'grid', 'gridTemplateColumns' : 'repeat(2, 50%)'}
          break;
      case 3:
          dynamicCols = {'display' : 'grid', 'gridTemplateColumns' : 'repeat(3, 33.333%)'}
          break;
      case 4:
          dynamicCols = {'display' : 'grid', 'gridTemplateColumns' : 'repeat(4, 25%)'}
          break;
      case 5:
          dynamicCols = {'display' : 'grid', 'gridTemplateColumns' : 'repeat(5, 20%)'}
          break;
      case 6:
          dynamicCols = {'display' : 'grid', 'gridTemplateColumns' : 'repeat(6, 16.666%)'}
          break;
      default:
          console.log(`There was an error`);
  }


    return(
      <div id="reqResContainer" style={dynamicCols}>
        {/* ReqResContainer */}
        {/* <div className={'reqResContainer_inner'}>
          <div className={'reqResContainer_inner-page'}>     */}
            {reqResArr}
          {/* </div> */}
          {/* <div className={'reqResContainer_inner-page'}>    
            {reqResArr}
          </div> */}
        {/* </div>
        <button className={'next'}></button> */}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReqResContainer);
