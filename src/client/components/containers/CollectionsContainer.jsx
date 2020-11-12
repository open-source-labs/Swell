import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../../../src/client/actions/actions.js";
import Collection from "../display/Collection.jsx";
import collectionsController from "../../controllers/collectionsController";

export default function CollectionsContainer() {
  const dispatch = useDispatch();

  const collections = useSelector(store => store.business.collections); 

  const handleClick = () => {
    collectionsController.importCollection(collections);
  }

  const collectionComponents = collections.map(
    (collection, idx) => {
      return (
        <Collection
          content={collection}
          key={idx}
          deleteFromCollection={() => {dispatch(actions.deleteFromCollection(collection))}}
          collectionToReqRes={(reqResArray) => {dispatch(actions.collectionToReqRes(reqResArray))}}
        />
      );
    }
  );

  return (
    <div>
      
      <div className="mt-3">
        <button
          className="button is-small is-primary is-outlined button-padding-verticals mx-3"
          type="button"
          onClick={(handleClick)}
        >
          Import Workspace
        </button>

        <hr />
      </div>
      
      <div>
        {collectionComponents}
      </div>
    </div>
  );
}
