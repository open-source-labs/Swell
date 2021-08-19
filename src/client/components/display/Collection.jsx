/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import collectionsController from '../../controllers/collectionsController';

const Collection = (props) => {
  const dispatch = useDispatch();
  const setWorkspaceTab = (tabName) =>
    dispatch(actions.setWorkspaceActiveTab(tabName));

  const addCollectionToReqResContainer = () => {
    props.collectionToReqRes(props.content.reqResArray);
    setWorkspaceTab('workspace');
  };

  const deleteCollection = (e) => {
    props.deleteFromCollection(props.content);
    collectionsController.deleteCollectionFromIndexedDb(e.target.id);
  };

  return (
    <div>
      <div className="is-flex is-justify-content-space-between m-5">
        <div
          className="is-clickable is-primary-link is-align-items-center is-flex"
          onClick={addCollectionToReqResContainer}
        >
          {props.content.name}
        </div>
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <div
            className="is-clickable is-primary-link m-3"
            onClick={() =>
              collectionsController.exportCollection(props.content.id)
            }
          >
            Export
          </div>
          <div
            className="is-clickable flex-grow-1 delete m-3"
            onClick={deleteCollection}
            id={props.content.id}
          />
        </div>
      </div>

      <hr />
    </div>
  );
};

export default Collection;
