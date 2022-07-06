import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

/**@todo delete after slice conversion complete */
import * as actions from '../../features/business/businessSlice';

import { reqResReplaced } from '../../toolkit-refactor/reqRes/reqResSlice';
import { collectionDeleted } from '../../toolkit-refactor/collections/collectionsSlice';

import Collection from '../../components/display/Collection';
import collectionsController from '../../controllers/collectionsController';
import githubController from '../../controllers/githubController';
import db from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';

function CollectionsContainer() {
  let files = useLiveQuery(() => db.files.toArray());
  const dispatch = useDispatch();

  const localWorkspaces = useSelector((store) => store.business.collections);
  const isDark = useSelector((state) => state.ui.isDark);

  const handleImportFromGithub = async () => {
    const githubWorkspaces = await githubController.importFromRepo();
    collectionsController.importFromGithub([
      ...localWorkspaces,
      ...githubWorkspaces,
    ]);
  };

  const collectionComponents = localWorkspaces.map((collection, idx) => {
    return (
      <Collection
        content={collection}
        key={idx}
        collectionDeleted={() => {
          dispatch(collectionDeleted(collection));
        }}
        reqResReplaced={(reqResArray) => {
          dispatch(reqResReplaced(reqResArray));
        }}
      />
    );
  });

  if (!files) return null;

  return (
    <div>
      <div className="mt-3 is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
        {/* <button
          className={`button is-medium is-primary ${
            isDark ? '' : 'is-outlined'
          } button-padding-verticals mx-3`}
          type="button"
          onClick={() =>
            collectionsController.importCollection(localWorkspaces)
          }
        >
          Import from Files
        </button> */}
        {/* <button
          className={`button is-medium is-primary ${
            isDark ? '' : 'is-outlined'
          } button-padding-verticals mx-3`}
          type="button"
          onClick={handleImportFromGithub}
        >
          Import from Github
        </button>
        {/* <ul>
          {files.map((file) => (
            <li key={file.repository.full_name}>{file.repository.name}</li>
          ))}
        </ul> */}
        <hr />
      </div>

      <div>{collectionComponents}</div>
    </div>
  );
}

export default CollectionsContainer;
