import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import SingleReqResContainer from "./SingleReqResContainer.jsx";
import ReqResCtrl from "../../controllers/reqResController";

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
  const { reqResArray, reqResDelete, reqResUpdate } = props;
  const dispatch = useDispatch();

  const reqResMapped = reqResArray.map((reqRes, index) => {
    return (
      <SingleReqResContainer
        className={`reqResChild`}
        content={reqRes}
        key={index}
        index={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
      />
    );
  });

  return (
    <div>

      {reqResArray.length > 0 &&
        <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
          <button
            className="button is-small is-danger is-outlined button-padding-vertical button-hover-color ml-3"
            style={{minWidth: '14vw'}}
            type="button"
            onClick={() => {
              for (let i = 0; i < reqResArray.length; i++) {
                setTimeout(function(){
                  ReqResCtrl.openReqRes(reqResArray[i].id);
                  dispatch(actions.saveCurrentResponseData(reqResArray[i]));
                 }, 800);
              }
            }}
          >
            Send Collection
          </button>
        </div>
      }

      <div>{reqResMapped.reverse()}</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReqResContainer);
