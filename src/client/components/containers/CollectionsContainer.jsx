import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../../../src/client/actions/actions.js";
import Collection from "../display/Collection.jsx";
import collectionsController from "../../controllers/collectionsController";

export default function CollectionsContainer({ setWorkspaceTab }) {
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
          setWorkspaceTab={setWorkspaceTab}
          key={idx}
          deleteFromCollection={() => {dispatch(actions.deleteFromCollection(collection))}}
          collectionToReqRes={() => {dispatch(actions.collectionToReqRes(collection.reqResArray))}}
        />
      );
    }
  );

  return (
    <div>
      
      <div>
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
