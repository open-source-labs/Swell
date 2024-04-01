import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import { RootState } from '../../../toolkit-refactor/store';
import openApiController from '../../../controllers/openApiController';

// this component is working as intened

const OpenAPIDocumentEntryForm: React.FC = () => {
  const isDark = useAppSelector((state: RootState) => state.ui.isDark);

  const importDoc = (): void => {
    openApiController.sendDocument();
    openApiController.importDocument();
  }

  return (
    <div className="mt-3">
      <div className="is-flex is-justify-content-flex-end is-align-content-center">
        <button
          className={`${
            isDark ? 'is-dark-300' : ''
          } button is-small add-header-or-cookie-button mr-1`}
          onClick={() => importDoc()}
        >
          Load Document
        </button>
      </div>
    </div>
  );
};

export default OpenAPIDocumentEntryForm;
