import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";
import Collection from "../display/Collection.jsx";
import collectionsController from "../../controllers/collectionsController";

const mapStateToProps = (store) => ({
  collections: store.business.collections,
});

const mapDispatchToProps = (dispatch) => ({
  deleteFromCollection: (collection) => {
    dispatch(actions.deleteFromCollection(collection));
  },
  collectionToReqRes: (reqResArray) => {
    dispatch(actions.collectionToReqRes(reqResArray));
  },
});

const CollectionsContainer = (props) => {
  const { 
    collections,
    deleteFromCollection,
    collectionToReqRes,
  } = props;

  const handleClick = () => {
    collectionsController.importCollection(collections);
  }

  const collectionComponents = collections.map(
    (collection, idx) => {
      return (
        <Collection
          content={collection}
          key={idx}
          deleteFromCollection={deleteFromCollection}
          collectionToReqRes={collectionToReqRes}
        />
      );
    }
  );

  return (
    <div className="collections-container">
      <h1 className="collection-heading">Saved Workspaces</h1>
      <div className="collection-import-container">
        <button className="import-collections" onClick={handleClick}>
          Import Workspace
        </button>
      </div>
      <div className="collections">
        {collectionComponents}
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionsContainer);
