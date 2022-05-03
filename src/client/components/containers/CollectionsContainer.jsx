import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import Collection from '../display/Collection';
import collectionsController from '../../controllers/collectionsController';
import axios from 'axios';

function CollectionsContainer() {
  const dispatch = useDispatch();

  const collections = useSelector((store) => store.business.collections);
  const isDark = useSelector(state => state.ui.isDark);

  const handleClick = () => {
    collectionsController.importCollection(collections);
  };

  const handleImportFromGithub = async () => {
    const response = await axios('/api/import');
    const workspaces = response.data;
    console.log('swellfile response', response.data);
    collectionsController.importFromGithub(collections, workspaces);
    // window.api.send('import-from-github', collections, workspaces);
  }

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
          className={`button is-medium is-primary ${isDark ? '' : 'is-outlined'} button-padding-verticals mx-3`}
          type="button"
          onClick={handleClick}
        >
          Import from Files
        </button>
        <button
          className={`button is-medium is-primary ${isDark ? '' : 'is-outlined'} button-padding-verticals mx-3`}
          type="button"
          onClick={handleImportFromGithub}
        >
          Import from Github
        </button>

        <hr />
      </div>

      <div>{collectionComponents}</div>
    </div>
  );
}

export default CollectionsContainer;
