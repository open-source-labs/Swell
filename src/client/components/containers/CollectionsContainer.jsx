import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import Collection from '../display/Collection';
import collectionsController from '../../controllers/collectionsController';

function CollectionsContainer() {
  const dispatch = useDispatch();

  const collections = useSelector((store) => store.business.collections);

  const handleClick = () => {
    collectionsController.importCollection(collections);
  };

  const collectionComponents = collections.map((collection, idx) => {
    return (
      <Collection
        content={collection}
        key={idx}
        deleteFromCollection={() => {
          dispatch(actions.deleteFromCollection(collection));
        }}
        collectionToReqRes={(reqResArray) => {
          dispatch(actions.collectionToReqRes(reqResArray));
        }}
      />
    );
  });

  return (
    <div>
      <div className="mt-3 is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
        <button
          className="button is-medium is-primary is-outlined button-padding-verticals mx-3"
          type="button"
          onClick={handleClick}
        >
          Import Workspace
        </button>

        <hr />
      </div>

      <div>{collectionComponents}</div>
    </div>
  );
}

export default CollectionsContainer;
