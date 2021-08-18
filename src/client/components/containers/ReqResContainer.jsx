import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import SingleReqResContainer from './SingleReqResContainer.jsx';
import ReqResCtrl from '../../controllers/reqResController';

const mapStateToProps = (store) => ({
  reqResArray: store.business.reqResArray,
  currentTab: store.business.currentTab,
});

const mapDispatchToProps = (dispatch) => ({
  reqResDelete: (reqRes) => {
    dispatch(actions.reqResDelete(reqRes));
  },
  reqResUpdate: (reqRes) => {
    dispatch(actions.reqResUpdate(reqRes));
  },
});

const ReqResContainer = (props) => {
  const { reqResArray, reqResDelete, reqResUpdate, displaySchedule } = props;

  const reqResMapped = reqResArray.map((reqRes, index) => {
    return (
      <SingleReqResContainer
        className="reqResChild"
        content={reqRes}
        key={index}
        index={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
      />
    );
  });

  const runCollectionTest = () => {
    ReqResCtrl.runCollectionTest(reqResArray);
  };

  return (
    <div>
      {reqResArray.length > 0 && displaySchedule && (
        <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
          <button
            className="button is-small is-rest-invert is-outlined button-padding-vertical button-hover-color"
            style={{ minWidth: '30vw' }}
            type="button"
            onClick={runCollectionTest}
          >
            Send Collection
          </button>
        </div>
      )}

      <div>{reqResMapped.reverse()}</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReqResContainer);
