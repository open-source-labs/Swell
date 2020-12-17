import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import SingleScheduleReqResContainer from "./SingleScheduleReqResContainer.jsx";
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

const ScheduleReqResContainer = (props) => {
  const { reqResArray, reqResDelete, reqResUpdate } = props;
  const dispatch = useDispatch();
  const [queue, setQueue] = useState([]);

  let reqResMapped = reqResArray.map((reqRes, index) => {
    return (
      <SingleScheduleReqResContainer
        className={`reqResChild`}
        content={reqRes}
        key={index}
        index={index}
        reqResDelete={reqResDelete}
        reqResUpdate={reqResUpdate}
      />
    );
  });
  reqResMapped = reqResMapped.reverse();

  useEffect(() => {
    const interval = setInterval(() => {
      //loop through reqResMapped
      //essentially click the send button of each
      let copyArr = JSON.parse(JSON.stringify(reqResArray));
      let idk = copyArr.map((reqRes, index) => {
        return (
          <SingleScheduleReqResContainer
            className={`reqResChild`}
            content={reqRes}
            key={index}
            index={index}
            reqResDelete={reqResDelete}
            reqResUpdate={reqResUpdate}
          />
        );
      });
      setQueue(queue => [...queue, ...idk]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>{reqResMapped}</div>
      <div> <p>Queue:</p>
      {queue}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleReqResContainer);
